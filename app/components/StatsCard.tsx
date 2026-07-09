"use client";

import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Zap, BarChart3, AlertTriangle } from "lucide-react";
import { cn, formatNumber, formatBigNumber } from "@/app/lib/utils";
import type { Transfer } from "@/app/hooks/useUsdtTransfers";

interface StatsCardProps {
  transfers: Transfer[];
  loading: boolean;
}

export function StatsCard({ transfers, loading }: StatsCardProps) {
  const totalVolume = transfers.reduce((sum, t) => sum + parseFloat(t.value), 0);
  const largeTxns = transfers.filter((t) => parseFloat(t.value) >= 100_000).length;
  const avgValue = transfers.length > 0 ? totalVolume / transfers.length : 0;

  const cards = [
    {
      label: "Total Volume",
      value: formatBigNumber(totalVolume),
      unit: "USDT",
      icon: BarChart3,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      ring: "ring-blue-500/20",
    },
    {
      label: "Transactions",
      value: transfers.length.toLocaleString(),
      unit: "Txns",
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      ring: "ring-emerald-500/20",
    },
    {
      label: "Large Transfers",
      value: largeTxns.toLocaleString(),
      unit: ">100K",
      icon: AlertTriangle,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      ring: "ring-amber-500/20",
    },
    {
      label: "Avg Transfer",
      value: formatBigNumber(avgValue),
      unit: "USDT",
      icon: Zap,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      ring: "ring-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className={cn(
            "relative overflow-hidden rounded-xl border border-slate-800/60 p-4 backdrop-blur-sm",
            "bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
          )}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">{card.label}</p>
              <p className="mt-1 text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">
                {loading && transfers.length === 0 ? (
                  <span className="inline-block h-7 w-20 animate-pulse rounded bg-slate-800" />
                ) : (
                  card.value
                )}
              </p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                {card.unit}
              </p>
            </div>
            <div className={cn("rounded-lg p-2 ring-1", card.bg, card.ring)}>
              <card.icon className={cn("h-4 w-4", card.color)} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
