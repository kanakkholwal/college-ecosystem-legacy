import { cn } from '@/lib/utils'
import { format, isSameDay } from 'date-fns'
import { useCalendarContext } from './context'
import type { CalendarEvent as CalendarEventType } from './types'

interface EventPosition {
  left: string
  width: string
  top: string
  height: string
}

function getOverlappingEvents(
  currentEvent: CalendarEventType,
  events: CalendarEventType[]
): CalendarEventType[] {
  return events.filter((event) => {
    if (event.id === currentEvent.id) return false
    return (
      currentEvent.start < event.end &&
      currentEvent.end > event.start &&
      isSameDay(currentEvent.start, event.start)
    )
  })
}

function calculateEventPosition(
  event: CalendarEventType,
  allEvents: CalendarEventType[],
  margin_hours: [number, number]
): EventPosition {
  const [startMargin, endMargin] = margin_hours || [0, 24];
  const totalMarginHours = endMargin - startMargin;

  const overlappingEvents = getOverlappingEvents(event, allEvents);
  const group = [event, ...overlappingEvents].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );
  const position = group.indexOf(event);
  const width = `${100 / (overlappingEvents.length + 1)}%`;
  const left = `${(position * 100) / (overlappingEvents.length + 1)}%`;

  // Adjust start and end times based on `margin_hours`
  const eventStartHour = event.start.getHours();
  const eventEndHour = event.end.getHours();
  const adjustedStartHour = Math.max(eventStartHour, startMargin);
  const adjustedEndHour = Math.min(eventEndHour, endMargin);

  // Calculate top position and height only for the visible margin hours
  const startMinutes = event.start.getMinutes();
  const endMinutes = event.end.getMinutes();
  const startPosition =
    (adjustedStartHour - startMargin) * (128 / totalMarginHours) +
    (startMinutes / 60) * (128 / totalMarginHours);
  const endPosition =
    (adjustedEndHour - startMargin) * (128 / totalMarginHours) +
    (endMinutes / 60) * (128 / totalMarginHours);

  const top = Math.max(0, startPosition); // Prevent negative positions
  const height = Math.max(0, endPosition - startPosition); // Ensure proper height

  return {
    left,
    width,
    top: `${top}px`,
    height: `${height}px`,
  };
}



export default function CalendarEvent({
  event,
  month = false,
  className,
}: {
  event: CalendarEventType
  month?: boolean
  className?: string
}) {
  const { events, setSelectedEvent, setManageEventDialogOpen, margin_hours } =
    useCalendarContext()

  const style = month ? {} : calculateEventPosition(event, events, margin_hours || [0, 24])

  return (
    <div
      key={event.id}

      className={cn(
        `px-3 py-1.5 rounded-md truncate cursor-pointer transition-all duration-300 bg-${event.color}-500/10 hover:bg-${event.color}-500/20 border border-${event.color}-500`,
        !month && 'absolute',
        className
      )}
      style={style}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedEvent(event)
        setManageEventDialogOpen(true)
      }}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation()
          setSelectedEvent(event)
          setManageEventDialogOpen(true)
        }
      }}
    >
      <div
        className={cn(
          `flex flex-col w-full text-${event.color}-500`,
          month && 'flex-row items-center justify-between'
        )}
      >
        <p className={cn('font-bold truncate', month && 'text-xs')}>
          {event.title}
        </p>
        <p className={cn('text-sm', month && 'text-xs')}>
          <span>{format(event.start, 'h:mm a')}</span>
          <span className={cn('mx-1', month && 'hidden')}>-</span>
          <span className={cn(month && 'hidden')}>
            {format(event.end, 'h:mm a')}
          </span>
        </p>
      </div>
    </div>
  )
}
