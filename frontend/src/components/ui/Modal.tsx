"use client";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, subtitle, children, footer, className }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            className={cn(
              "relative w-full max-w-lg bg-dark-card border border-dark-border rounded-2xl shadow-card overflow-hidden",
              className
            )}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-start justify-between px-5 py-4 border-b border-dark-border">
              <div>
                {title && <h3 className="text-base font-semibold text-white">{title}</h3>}
                {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4 max-h-[70vh] overflow-y-auto">{children}</div>
            {footer && (
              <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-dark-border">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
