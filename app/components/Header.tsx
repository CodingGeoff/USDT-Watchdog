"use client";

import { Shield, Activity, Clock } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface HeaderProps {
  blockHeight: number | null;
  watchActive: boolean;
  lastUpdated: number;
}

export function Header({ blockHeight, watchActive, lastUpdated }: HeaderProps) {
  const secondsAgo = Math.floor((Date.now() - lastUpdated) / 1000);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <Shield className="h-5 w-5 text-emerald-400" />
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span
                className={cn(
                  "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                  watchActive ? "bg-emerald-400" : "bg-amber-400"
                )}
              />
              <span
                className={cn(
                  "relative inline-flex h-2.5 w-2.5 rounded-full",
                  watchActive ? "bg-emerald-500" : "bg-amber-500"
                )}
              />
            </span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-100 sm:text-xl">
              USDT Watchdog
            </h1>
            <p className="hidden text-xs text-slate-400 sm:block">
              Real-time Ethereum USDT Transfer Monitor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1.5 ring-1 ring-slate-800 sm:flex">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-slate-300">
              Block {blockHeight ? blockHeight.toLocaleString() : "—"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-slate-900/60 px-3 py-1.5 ring-1 ring-slate-800">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs tabular-nums text-slate-400">
              {secondsAgo < 60 ? `${secondsAgo}s` : `${Math.floor(secondsAgo / 60)}m`} ago
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
