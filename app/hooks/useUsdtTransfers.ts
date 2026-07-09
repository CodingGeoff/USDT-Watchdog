"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { parseAbiItem, formatUnits } from "viem";
import { ethClient, USDT_ADDRESS } from "@/app/lib/client";
import type { ApiStatRecord } from "./useApiStats";

export interface Transfer {
  blockNumber: number;
  transactionHash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
}

const TRANSFER_ABI = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)"
);

export function useUsdtTransfers(
  trackCall: (method: string, duration: number, success: boolean, errorMessage?: string) => void
) {
  const [currentBlockHeight, setCurrentBlockHeight] = useState<number | null>(null);
  const [currentBlockHash, setCurrentBlockHash] = useState<string | null>(null);
  const [usdtTransfers, setUsdtTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const [watchActive, setWatchActive] = useState(false);
  const unwatchRef = useRef<(() => void) | null>(null);
  const isMounted = useRef(true);

  const fetchLatestBlock = useCallback(async () => {
    const start = performance.now();
    try {
      const block = await ethClient.getBlock({ blockTag: "latest" });
      const duration = Math.round(performance.now() - start);
      if (!isMounted.current) return;
      setCurrentBlockHeight(Number(block.number));
      setCurrentBlockHash(block.hash);
      setLastUpdated(Date.now());
      trackCall("eth_getBlockByNumber", duration, true);
      return Number(block.number);
    } catch (err: any) {
      const duration = Math.round(performance.now() - start);
      trackCall("eth_getBlockByNumber", duration, false, err.message);
      throw err;
    }
  }, [trackCall]);

  const fetchTransfers = useCallback(async (blockNumber: number) => {
    const start = performance.now();
    try {
      const fromBlock = BigInt(blockNumber - 10);
      const toBlock = BigInt(blockNumber);
      const logs = await ethClient.getLogs({
        address: USDT_ADDRESS,
        event: TRANSFER_ABI,
        fromBlock,
        toBlock,
      });
      const duration = Math.round(performance.now() - start);
      if (!isMounted.current) return;

      const newTransfers: Transfer[] = logs
        .map((log) => {
          const { from, to, value } = (log as any).args || {};
          return {
            blockNumber: Number(log.blockNumber),
            transactionHash: log.transactionHash,
            from: (from as string) || "0x0000",
            to: (to as string) || "0x0000",
            value: value ? Number(formatUnits(value, 6)).toFixed(2) : "0.00",
            timestamp: Date.now(),
          };
        })
        .sort((a, b) => b.blockNumber - a.blockNumber)
        .slice(0, 50);

      setUsdtTransfers((prev) => {
        const merged = [...newTransfers, ...prev];
        const unique = Array.from(new Map(merged.map((t) => [t.transactionHash, t])).values());
        return unique.slice(0, 100);
      });
      setLastUpdated(Date.now());
      trackCall("eth_getLogs", duration, true);
    } catch (err: any) {
      const duration = Math.round(performance.now() - start);
      trackCall("eth_getLogs", duration, false, err.message);
      if (isMounted.current) setError(err.message || "Failed to fetch transfers");
    }
  }, [trackCall]);

  const startWatching = useCallback(() => {
    if (unwatchRef.current) return;
    setWatchActive(true);
    const unwatch = ethClient.watchBlockNumber({
      onBlockNumber: async (blockNumber) => {
        if (!isMounted.current || blockNumber === undefined) return;
        const bn = Number(blockNumber);
        setCurrentBlockHeight(bn);
        setError(null);
        await fetchTransfers(bn);
      },
      onError: (err) => {
        if (isMounted.current) setError(err.message || "Watch error");
      },
      emitOnBegin: true,
    });
    unwatchRef.current = unwatch;
  }, [fetchTransfers]);

  const stopWatching = useCallback(() => {
    if (unwatchRef.current) {
      unwatchRef.current();
      unwatchRef.current = null;
    }
    setWatchActive(false);
  }, []);

  const manualRefresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const bn = await fetchLatestBlock();
      if (bn) await fetchTransfers(bn);
    } catch (err: any) {
      setError(err.message || "Refresh failed");
    } finally {
      setLoading(false);
    }
  }, [fetchLatestBlock, fetchTransfers]);

  useEffect(() => {
    isMounted.current = true;
    manualRefresh().then(() => {
      if (isMounted.current) startWatching();
    });
    return () => {
      isMounted.current = false;
      stopWatching();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    currentBlockHeight,
    currentBlockHash,
    usdtTransfers,
    loading,
    error,
    lastUpdated,
    watchActive,
    manualRefresh,
    startWatching,
    stopWatching,
  };
}
