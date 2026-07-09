"use client";

import { RefreshCw, Pause, Play, AlertTriangle, Database } from "lucide-react";
import { Header } from "./components/Header";
import { StatsCard } from "./components/StatsCard";
import { ApiUsagePanel } from "./components/ApiUsagePanel";
import { TransferCard } from "./components/TransferCard";
import { LoadingSkeleton, StatsSkeleton } from "./components/LoadingSkeleton";
import { useApiStats } from "./hooks/useApiStats";
import { useUsdtTransfers } from "./hooks/useUsdtTransfers";
import { motion, AnimatePresence } from "framer-motion";
import { cn, truncateAddress } from "./lib/utils";

export default function HomePage() {
  const apiStats = useApiStats();
  const {
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
  } = useUsdtTransfers(apiStats.trackCall);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header
        blockHeight={currentBlockHeight}
        watchActive={watchActive}
        lastUpdated={lastUpdated}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Block Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "mb-6 flex flex-col gap-3 rounded-xl border border-slate-800/60 bg-slate-900/50 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 ring-1 ring-slate-700">
              <Database className="h-5 w-5 text-slate-300" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Current Block</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tabular-nums text-slate-100">
                  {currentBlockHeight ? currentBlockHeight.toLocaleString() : "—"}
                </span>
                {currentBlockHash && (
                  <span className="hidden font-mono text-xs text-slate-500 sm:inline">
                    {truncateAddress(currentBlockHash, 12, 8)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={manualRefresh}
              disabled={loading}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-slate-700 transition-all hover:bg-slate-700 hover:text-white",
                loading && "cursor-not-allowed opacity-60"
              )}
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              Refresh
            </button>
            <button
              onClick={watchActive ? stopWatching : startWatching}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ring-1 transition-all",
                watchActive
                  ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20 hover:bg-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 ring-amber-500/20 hover:bg-amber-500/20"
              )}
            >
              {watchActive ? (
                <>
                  <Pause className="h-4 w-4" />
                  Live
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Paused
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {loading && usdtTransfers.length === 0 ? (
          <StatsSkeleton />
        ) : (
          <div className="mb-6">
            <StatsCard transfers={usdtTransfers} loading={loading} />
          </div>
        )}

        {/* API Usage Panel */}
        <div className="mb-6">
          <ApiUsagePanel
            totalCalls={apiStats.totalCalls}
            totalErrors={apiStats.totalErrors}
            avgDuration={apiStats.avgDuration}
            lastHour={apiStats.lastHour}
            lastDay={apiStats.lastDay}
            dailyStats={apiStats.dailyStats}
            estimatedCU={apiStats.estimatedCU}
            estimatedCost={apiStats.estimatedCost}
            resetStats={apiStats.resetStats}
            mounted={apiStats.mounted}
          />
        </div>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <div>
                  <p className="font-medium">Connection Error</p>
                  <p className="mt-0.5 text-xs text-red-400/80">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transfers List */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">
            Latest USDT Transfers
          </h2>
          <span className="text-xs text-slate-500">
            {usdtTransfers.length} records
          </span>
        </div>

        <div className="space-y-3">
          {loading && usdtTransfers.length === 0 ? (
            <LoadingSkeleton />
          ) : usdtTransfers.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800/60 bg-slate-900/50 py-16 text-slate-400">
              <Database className="mb-2 h-8 w-8 text-slate-600" />
              <p className="text-sm">No transfers found</p>
              <p className="mt-1 text-xs text-slate-500">Try refreshing or waiting for new blocks</p>
            </div>
          ) : (
            usdtTransfers.map((transfer, i) => (
              <TransferCard key={transfer.transactionHash} transfer={transfer} index={i} />
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950/80 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-slate-500 sm:flex-row sm:px-6">
          <span>USDT Watchdog — Real-time Ethereum Monitor</span>
          <span>Built with Next.js + viem + Tailwind CSS</span>
        </div>
      </footer>
    </div>
  );
}
