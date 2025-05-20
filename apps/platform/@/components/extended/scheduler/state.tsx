import { create } from "zustand";

import { z } from "zod";

const eventSchema = z.object({
  _id: z.string(),
  title: z.string(),
  color: z.string(),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

export type EventType = z.infer<typeof eventSchema>;

type StateType = {
  events: EventType[];
  addEvent: (event: EventType) => void;
  removeEvent: (id: string) => void;
  updateEvent: (id: string, updatedEvent: Partial<EventType>) => void;
  mode: "day" | "week" | "month";
  setMode: (mode: "day" | "week" | "month") => void;
};

export const useCalendarStore = create<StateType>((set) => ({
  events: [],
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  removeEvent: (id) =>
    set((state) => ({ events: state.events.filter((e) => e._id !== id) })),
  updateEvent: (id, updatedEvent) =>
    set((state) => ({
      events: state.events.map((e) =>
        e._id === id ? { ...e, ...updatedEvent } : e
      ),
    })),
  mode: "day",
  setMode: (mode) => set(() => ({ mode })),
}));
