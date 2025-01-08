import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { useCalendarContext } from '../../calendar-context'

export const hours = Array.from({ length: 24 }, (_, i) => i)

export default function CalendarBodyMarginDayMargin({
  className,
}: {
  className?: string
}) {
  const { margin_hours } = useCalendarContext()

  const [startHour, endHour] = margin_hours || [0, 24]
  // margin hours to show in between hours 
  const marginHours = hours.slice(startHour, endHour)

  return (
    <div
      className={cn(
        'sticky left-0 w-12 bg-background z-10 flex flex-col',
        className
      )}
    >
      <div className="sticky top-0 left-0 h-[33px] bg-background z-20 border-b" />
      <div className="sticky left-0 w-12 bg-background z-10 flex flex-col">
        {marginHours.map((hour) => (
          <div key={hour} className="relative h-32 first:mt-0">
            {hour !== 0 && (
              <span className="absolute text-xs text-muted-foreground -top-2.5 first:top-0 left-2">
                {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
