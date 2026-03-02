import { create } from "zustand";
import type { SocketEvent } from "@/types/events";

type EventsState = {
  events: SocketEvent[];
  addEvent: (event: SocketEvent) => void;
  clear: () => void;
};

const MAX_EVENTS = 200;

export const useEventsStore = create<EventsState>((set) => ({
  events: [],
  addEvent: (event) =>
    set((state) => {
      const next = [event, ...state.events];
      return { events: next.slice(0, MAX_EVENTS) };
    }),
  clear: () => set({ events: [] }),
}));