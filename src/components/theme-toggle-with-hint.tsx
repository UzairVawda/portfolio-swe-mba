"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";

const STORAGE_KEY = "uv:theme-hint-dismissed";

export function ThemeToggleWithHint() {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(STORAGE_KEY)) return;
    const timer = window.setTimeout(() => setShowHint(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "1");
    }
    setShowHint(false);
  };

  return (
    <div className="relative">
      <ThemeToggle onAfterToggle={dismiss} />

      <AnimatePresence>
        {showHint ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full z-50 mt-3 w-60 rounded-xl border border-border bg-card p-4 text-left shadow-lg"
            role="status"
          >
            <span
              aria-hidden
              className="absolute -top-1.5 right-4 h-3 w-3 rotate-45 border-l border-t border-border bg-card"
            />
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <p className="pr-6 text-sm font-medium text-foreground">
              Theme toggle
            </p>
            <p className="mt-1 pr-2 text-xs text-muted-foreground">
              Defaulting to dark — tap here any time to switch.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
