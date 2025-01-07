import { format } from 'date-fns'
import { useCalendarContext } from '../../calendar-context'
import CalendarHeaderDateBadge from './calendar-header-date-badge'
import CalendarHeaderDateChevrons from './calendar-header-date-chevrons'
import CalendarHeaderDateIcon from './calendar-header-date-icon'

export default function CalendarHeaderDate() {
  const { date } = useCalendarContext()
  return (
    <div className="flex items-center gap-2" suppressHydrationWarning={true}>
      <CalendarHeaderDateIcon />
      <div>
        <div className="flex items-center gap-1">
          <p className="text-lg font-semibold">{format(date, 'MMMM yyyy')}</p>
          <CalendarHeaderDateBadge />
        </div>
        <CalendarHeaderDateChevrons />
      </div>
    </div>
  )
}
