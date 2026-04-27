"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Crown, CheckCircle2, X } from "lucide-react";

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export function ProUpgradeModal({ isOpen, onClose, message }: ProUpgradeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl pointer-events-auto"
            >
              <div className="relative p-8">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-500 shadow-inner">
                  <Crown size={32} strokeWidth={2.5} />
                </div>

                <h3 className="mb-2 text-2xl font-black text-slate-900">
                  Desbloquea el Poder PRO
                </h3>
                
                {message && (
                  <p className="mb-6 rounded-xl bg-amber-50 p-3 text-sm font-medium text-amber-800">
                    {message}
                  </p>
                )}

                <ul className="mb-8 space-y-4">
                  <li className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 className="text-brand-turquoise" size={20} />
                    <span className="font-medium">Alias personalizados ilimitados</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 className="text-brand-turquoise" size={20} />
                    <span className="font-medium">Límite de enlaces extendido</span>
                  </li>
                </ul>

                <div className="flex flex-col gap-3">
                  <button className="w-full rounded-full bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                    Ver Planes
                  </button>
                  <button 
                    onClick={onClose}
                    className="w-full rounded-full px-5 py-3.5 text-sm font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
