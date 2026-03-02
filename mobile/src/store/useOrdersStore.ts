import { create } from "zustand";
import type { Order } from "@/types/events";

type OrdersState = {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  upsertOrder: (order: Order) => void;
  clear: () => void;
};

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),

  upsertOrder: (order) =>
    set((state) => {
      const idx = state.orders.findIndex((o) => o.id === order.id);
      if (idx === -1) return { orders: [order, ...state.orders] };

      const next = [...state.orders];
      next[idx] = order;

      // keep newest updated at top
      next.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      return { orders: next };
    }),

  clear: () => set({ orders: [] }),
}));