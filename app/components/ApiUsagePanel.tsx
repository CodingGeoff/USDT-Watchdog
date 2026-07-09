"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Activity,
  AlertCircle,
  DollarSign,
  BarChart2,
} from "lucide-react";
import { cn, formatNumber } from "@/app/lib/utils";
import type { DailyStats } from "@/app/hooks/useApiStats";

interface ApiUsagePanelProps {
  totalCalls: number;
  totalErrors: number;
  avgDuration: number;
  lastHour: number;
  lastDay: number;
  dailyStats: DailyStats[];
  estimatedCU: number;
  estimatedCost: number;
  resetStats: () => void;
  mounted: boolean;
}

export function ApiUsagePanel({
  totalCalls,
  totalErrors,
  avgDuration,
  lastHour,
  lastDay,
  dailyStats,
  estimatedCU,
  estimatedCost,
  resetStats,
  mounted,
}: ApiUsagePanelProps) {
  const [expanded, setExpanded] = useState(false);

  if (!mounted) return null;

  const successRate = totalCalls > 0 ? ((totalCalls - totalErrors) / totalCalls) * 100 : 100;

  const miniCards = [
    { label: "Total Calls", value: totalCalls.toLocaleString(), icon: Activity },
    { label: "Last Hour", value: lastHour.toLocaleString(), icon: BarChart2 },
    { label: "Last 24h", value: lastDay.toLocaleString(), icon: Server },
    { label: "Avg Latency", value: `${Math.round(avgDuration)}ms`, icon: Activity },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800/60 bg-slate-900/50 backdrop-blur-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/20">
            <Server className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">API Usage Dashboard</h3>
            <p className="text-xs text-slate-400">Click to expand details</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
              {totalCalls} calls
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                successRate >= 95
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              )}
            >
              {successRate.toFixed(1)}% OK
            </span>
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border-t border-slate-800/60 px-4 py-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {miniCards.map((c) => (
                  <div
                    key={c.label}
                    className="rounded-lg bg-slate-950/40 p-3 ring-1 ring-slate-800/60"
                  >
                    <div className="flex items-center gap-2 text-slate-400">
                      <c.icon className="h-3.5 w-3.5" />
                      <span className="text-[10px] uppercase tracking-wider">{c.label}</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold text-slate-100">{c.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-950/40 p-3 ring-1 ring-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-400">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="text-[10px] uppercase tracking-wider">Estimated Cost</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">
                    <span className="text-lg font-semibold text-slate-100">
                      ${estimatedCost.toFixed(4)}
                    </span>{" "}
                    / mo
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Based on Alchemy Growth tier pricing (~{formatNumber(estimatedCU)} CU)
                  </p>
                </div>
                <div className="rounded-lg bg-slate-950/40 p-3 ring-1 ring-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span className="text-[10px] uppercase tracking-wider">Errors</span>
                  </div>
                  <p className="mt-1 text-lg font-semibold text-slate-100">{totalErrors}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Failed requests out of {totalCalls} total
                  </p>
                </div>
              </div>

              {dailyStats.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-2 text-xs font-medium text-slate-400">Daily History</h4>
                  <div className="space-y-1.5">
                    {dailyStats.map((day) => (
                      <div
                        key={day.date}
                        className="flex items-center justify-between rounded-md bg-slate-950/40 px-3 py-2 ring-1 ring-slate-800/40"
                      >
                        <span className="text-xs text-slate-300">{day.date}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400">{day.count} calls</span>
                          <span className="text-xs text-slate-500">{day.avgDuration}ms</span>
                          {day.errors > 0 && (
                            <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] text-red-400">
                              {day.errors} err
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetStats}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-slate-100"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset Stats
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
