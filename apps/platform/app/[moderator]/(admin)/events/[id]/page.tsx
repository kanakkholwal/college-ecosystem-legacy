import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventById } from "~/actions/events";

export default async function EventPage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const params = await props.params;
  const event = await getEventById(params.id);
  if (!event) {
    return notFound();
  }
  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Event Details</h1>
      <div className="bg-card p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">{event.title}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {format(new Date(event.time), "PPPpp")}
        </p>
        <p className="mb-4 text-sm text-muted-foreground">
          {event.description}
        </p>
        <p className="text-sm text-muted-foreground">
          {event.location
            ? `Location: ${event.location}`
            : "No location specified"}
        </p>
        <p className="text-sm text-muted-foreground">
          {event.endDate
            ? `Ends: ${format(new Date(event.endDate), "PPPpp")}`
            : "No end date specified"}
        </p>
        <div className="mt-4 space-x-2">
          <Button variant="default" size="sm" asChild>
            <Link href={`/admin/events/${event.id}/edit`}>Edit Event</Link>
          </Button>
          <Button variant="destructive_light" size="sm">
            Delete Event
          </Button>
        </div>
      </div>
    </div>
  );
}
