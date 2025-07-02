'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Event } from '~/types/clubs';

interface UpcomingEventsProps {
  events: Event[];
  onRegister?: (eventId: string) => void;
}

export function UpcomingEvents({ events, onRegister }: UpcomingEventsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No upcoming events at the moment
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
          >
            {event.image && (
              <div className="relative h-32 rounded-md overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div>
              <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
              <p className="text-xs text-muted-foreground mb-2">
                by {event.clubName}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {event.description}
              </p>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(event.date)}</span>
                <Clock className="h-3 w-3 ml-2" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{event.venue}</span>
              </div>
              {event.maxParticipants && (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>
                    {event.currentParticipants}/{event.maxParticipants} registered
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Badge
                variant={event.registrationOpen ? "default" : "secondary"}
                className="text-xs"
              >
                {event.registrationOpen ? "Open" : "Closed"}
              </Badge>
              {event.registrationOpen && (
                <Button
                  size="sm"
                  className="text-xs px-3 py-1 h-auto"
                  onClick={() => onRegister?.(event.id)}
                >
                  Register
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}