"use client";

import { motion } from "framer-motion";
import {
  Copy,
  ExternalLink,
  ArrowRightLeft,
  Clock,
  Hash,
  Wallet,
  DollarSign,
} from "lucide-react";
import {
  cn,
  truncateAddress,
  getEtherscanLink,
  getTimeAgo,
} from "@/app/lib/utils";
import type { Transfer } from "@/app/hooks/useUsdtTransfers";
import { useState, useCallback } from "react";

interface TransferCardProps {
  transfer: Transfer;
  index: number;
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [text]);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        copy();
      }}
      className={cn(
        "ml-1.5 inline-flex items-center rounded p-1 transition-colors",
        copied
          ? "bg-emerald-500/20 text-emerald-400"
          : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
      )}
      title={label || "Copy"}
    >
      <Copy className="h-3 w-3" />
      {copied && (
        <span className="ml-1 text-[10px] font-medium">Copied!</span>
      )}
    </button>
  );
}

export function TransferCard({ transfer, index }: TransferCardProps) {
  const value = parseFloat(transfer.value);
  const isLarge = value >= 100_000;
  const isMedium = value >= 10_000;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-slate-800/60 bg-slate-900/50 p-4 backdrop-blur-sm transition-all hover:border-slate-700/80 hover:bg-slate-800/50",
        isLarge && "border-amber-500/30 bg-amber-950/10"
      )}
    >
      {isLarge && (
        <div className="absolute -right-8 -top-8 h-16 w-16 rotate-45 bg-amber-500/10 blur-xl" />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md ring-1",
                isLarge
                  ? "bg-amber-500/10 text-amber-400 ring-amber-500/20"
                  : isMedium
                  ? "bg-blue-500/10 text-blue-400 ring-blue-500/20"
                  : "bg-slate-700/40 text-slate-400 ring-slate-600/30"
              )}
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <Hash className="h-3 w-3 text-slate-500" />
              <a
                href={getEtherscanLink("tx", transfer.transactionHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300 hover:underline"
              >
                {truncateAddress(transfer.transactionHash, 10, 6)}
              </a>
              <CopyButton text={transfer.transactionHash} label="Copy Tx Hash" />
              <a
                href={getEtherscanLink("tx", transfer.transactionHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-0.5 inline-flex items-center rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-1.5">
              <Wallet className="h-3 w-3 text-slate-500" />
              <span className="text-[10px] uppercase tracking-wider text-slate-500">From</span>
              <a
                href={getEtherscanLink("address", transfer.from)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-slate-300 hover:text-slate-100 hover:underline"
              >
                {truncateAddress(transfer.from)}
              </a>
              <CopyButton text={transfer.from} label="Copy From Address" />
            </div>

            <div className="hidden h-px w-4 bg-slate-700 sm:block" />

            <div className="flex items-center gap-1.5">
              <Wallet className="h-3 w-3 text-slate-500" />
              <span className="text-[10px] uppercase tracking-wider text-slate-500">To</span>
              <a
                href={getEtherscanLink("address", transfer.to)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-slate-300 hover:text-slate-100 hover:underline"
              >
                {truncateAddress(transfer.to)}
              </a>
              <CopyButton text={transfer.to} label="Copy To Address" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
          <div className="flex items-center gap-1.5">
            <DollarSign
              className={cn(
                "h-4 w-4",
                isLarge ? "text-amber-400" : isMedium ? "text-blue-400" : "text-slate-400"
              )}
            />
            <span
              className={cn(
                "text-base font-bold tabular-nums sm:text-lg",
                isLarge ? "text-amber-400" : isMedium ? "text-blue-400" : "text-slate-100"
              )}
            >
              {transfer.value}
            </span>
            <span className="text-xs font-medium text-slate-500">USDT</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <span className="text-[10px] tabular-nums">Block #{transfer.blockNumber.toLocaleString()}</span>
            <span className="hidden h-3 w-px bg-slate-700 sm:block" />
            <span className="flex items-center gap-1 text-[10px] tabular-nums">
              <Clock className="h-3 w-3" />
              {getTimeAgo(transfer.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
