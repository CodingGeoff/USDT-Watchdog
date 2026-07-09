"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface ApiStatRecord {
  timestamp: number;
  method: string;
  duration: number;
  success: boolean;
  errorMessage?: string;
}

export interface DailyStats {
  date: string;
  count: number;
  errors: number;
  avgDuration: number;
}

const STORAGE_KEY = "usdt-watchdog-api-stats";

function loadRecords(): ApiStatRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveRecords(records: ApiStatRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // ignore quota exceeded
  }
}

export function useApiStats() {
  const [records, setRecords] = useState<ApiStatRecord[]>([]);
  const [mounted, setMounted] = useState(false);
  const recordsRef = useRef<ApiStatRecord[]>([]);

  useEffect(() => {
    const loaded = loadRecords();
    setRecords(loaded);
    recordsRef.current = loaded;
    setMounted(true);
  }, []);

  useEffect(() => {
    recordsRef.current = records;
    saveRecords(records);
  }, [records]);

  const trackCall = useCallback(
    (method: string, duration: number, success: boolean, errorMessage?: string) => {
      const record: ApiStatRecord = {
        timestamp: Date.now(),
        method,
        duration,
        success,
        errorMessage,
      };
      setRecords((prev) => {
        const next = [record, ...prev].slice(0, 5000);
        return next;
      });
    },
    []
  );

  const resetStats = useCallback(() => {
    setRecords([]);
    recordsRef.current = [];
    saveRecords([]);
  }, []);

  const totalCalls = records.length;
  const totalErrors = records.filter((r) => !r.success).length;
  const avgDuration =
    totalCalls > 0
      ? records.reduce((sum, r) => sum + r.duration, 0) / totalCalls
      : 0;

  const now = Date.now();
  const lastHour = records.filter((r) => now - r.timestamp < 3600_000).length;
  const lastDay = records.filter((r) => now - r.timestamp < 86400_000).length;

  const dailyStats = (() => {
    const map: Record<string, { count: number; errors: number; durationSum: number }> = {};
    records.forEach((r) => {
      const date = new Date(r.timestamp).toISOString().split("T")[0];
      if (!map[date]) map[date] = { count: 0, errors: 0, durationSum: 0 };
      map[date].count += 1;
      if (!r.success) map[date].errors += 1;
      map[date].durationSum += r.duration;
    });
    return Object.entries(map)
      .map(([date, v]) => ({
        date,
        count: v.count,
        errors: v.errors,
        avgDuration: Math.round(v.durationSum / v.count),
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 7);
  })();

  // Alchemy pricing estimate (Growth tier: $49/mo for 300M CUs)
  // getLogs ~ 75 CU, getBlock ~ 16 CU, watchBlockNumber ~ 0 (websockets not used here)
  const estimatedCU = totalCalls * 50;
  const estimatedCost = estimatedCU > 0 ? (estimatedCU / 300_000_000) * 49 : 0;

  return {
    records,
    mounted,
    trackCall,
    resetStats,
    totalCalls,
    totalErrors,
    avgDuration,
    lastHour,
    lastDay,
    dailyStats,
    estimatedCU,
    estimatedCost,
  };
}
