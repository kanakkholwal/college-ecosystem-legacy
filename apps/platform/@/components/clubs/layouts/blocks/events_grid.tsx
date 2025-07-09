"use client"
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

type EventItem = {
  id: string;
  title: string;
  description: string;
};

const Events: EventItem[] = [
  {
    id: "1",
    title: "Pay supplier invoices",
    description:
      "Our goal is to streamline SMB trade, making it easier and faster than ever.",
  },
  {
    id: "2",
    title: "Pay supplier invoices",
    description:
      "Our goal is to streamline SMB trade, making it easier and faster than ever.",
  },
  {
    id: "3",
    title: "Pay supplier invoices",
    description:
      "Our goal is to streamline SMB trade, making it easier and faster than ever.",
  },
  {
    id: "4",
    title: "Pay supplier invoices",
    description:
      "Our goal is to streamline SMB trade, making it easier and faster than ever.",
  },
  {
    id: "5",
    title: "Pay supplier invoices",
    description:
      "Our goal is to streamline SMB trade, making it easier and faster than ever.",
  },
  {
    id: "6",
    title: "Pay supplier invoices",
    description:
      "Our goal is to streamline SMB trade, making it easier and faster than ever.",
  },
];

function EventCard({ title, description, id }: EventItem) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: parseInt(id) * 0.1 }} className="flex flex-col gap-2">
      <div className="bg-muted rounded-md aspect-video mb-2" />
      <h3 className="text-xl tracking-tight">{title}</h3>
      <p className="text-muted-foreground text-base">{description}</p>
    </motion.div>
  );
}

function EventsGrid({ events = Events }: { events: EventItem[] }) {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge>Platform</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                Something new!
              </h2>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                Managing a small business today is already tough.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((Event) => (
              <EventCard key={Event.id} {...Event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsGrid
