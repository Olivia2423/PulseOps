import { create } from "zustand";
import type { AuditLog } from "@/types/events";

type AuditState = {
  logs: AuditLog[];
  setLogs: (logs: AuditLog[]) => void;
  addLog: (log: AuditLog) => void;
  clear: () => void;
};

const MAX_LOGS = 200;

export const useAuditStore = create<AuditState>((set) => ({
  logs: [],
  setLogs: (logs) => set({ logs: logs.slice(0, MAX_LOGS) }),
  addLog: (log) =>
    set((state) => {
      const next = [log, ...state.logs];
      return { logs: next.slice(0, MAX_LOGS) };
    }),
  clear: () => set({ logs: [] }),
}));