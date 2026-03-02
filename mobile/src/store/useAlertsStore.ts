import { create } from "zustand";
import type { Alert } from "@/types/events";

type AlertsState = {
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  upsertAlert: (alert: Alert) => void;
  clear: () => void;
};

export const useAlertsStore = create<AlertsState>((set) => ({
  alerts: [],

  setAlerts: (alerts) => set({ alerts }),

  upsertAlert: (alert) =>
    set((state) => {
      const idx = state.alerts.findIndex((a) => a.id === alert.id);

      if (idx === -1) {
        return { alerts: [alert, ...state.alerts] };
      }

      const next = [...state.alerts];
      next[idx] = alert;
      return { alerts: next };
    }),

  clear: () => set({ alerts: [] }),
}));