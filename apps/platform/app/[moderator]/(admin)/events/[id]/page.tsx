import { ActionButton } from "@/components/application/action-bar";
import { ButtonLink } from "@/components/utils/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { deleteEvent, getEventById } from "~/actions/common.events";

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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium3">Event Details</h2>
        <ActionButton
          variant="destructive"
          size="sm"
          actionName="Event Deletion"
          loadingLabel="Deleting event..."
          action={deleteEvent.bind(null, event.id)}
        >
          Delete Event
        </ActionButton>
      </div>
      <div className="bg-card p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">{event.title}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {format(new Date(event.time), "dd MMMM yyyy 'at' hh:mm a")}
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
            ? `Ends: ${format(new Date(event.endDate), "dd MMMM yyyy 'at' hh:mm a")}`
            : "No end date specified"}
        </p>
        <div className="mt-4 space-x-2">
          <ButtonLink
            variant="rainbow"
            size="sm"
            href={`/admin/events/${event.id}/edit`}
          >
            Edit Event
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
