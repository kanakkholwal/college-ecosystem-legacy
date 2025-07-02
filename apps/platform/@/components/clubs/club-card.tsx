'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, CheckCircle, Eye, Users } from 'lucide-react';
import { useState } from 'react';
import { Club } from '~/types/clubs';

interface ClubCardProps {
  club: Club;
  onJoin?: (clubId: string) => void;
  isJoined?: boolean;
}

export function ClubCard({ club, onJoin, isJoined = false }: ClubCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      style={{
        borderTop: `4px solid ${club.theme.primaryColor}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16 border-2" style={{ borderColor: club.theme.primaryColor }}>
            <AvatarImage src={club.logo} alt={club.name} />
            <AvatarFallback 
              className="text-card-foreground text-lg font-bold"
              style={{ backgroundColor: club.theme.primaryColor }}
            >
              {club.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg truncate">{club.name}</h3>
              {club.isVerified && (
                <CheckCircle className="size-5 text-primary flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{club.tagline}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {club.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{club.members} members</span>
          </div>
          {club.nextEvent && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="truncate">{club.nextEvent.title}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {club.tags.slice(0, 3).map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs"
              style={{
                backgroundColor: `${club.theme.primaryColor}20`,
                color: club.theme.primaryColor,
                borderColor: `${club.theme.primaryColor}40`
              }}
            >
              {tag}
            </Badge>
          ))}
          {club.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{club.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} flex items-end justify-center p-6`}>
          <div className="flex gap-2 w-full">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={club.logo} alt={club.name} />
                      <AvatarFallback style={{ backgroundColor: club.theme.primaryColor }}>
                        {club.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {club.name}
                    {club.isVerified && <CheckCircle className="h-5 w-5 text-blue-500" />}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{club.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">President:</span> {club.president.name}
                    </div>
                    <div>
                      <span className="font-semibold">Established:</span> {club.established}
                    </div>
                    <div>
                      <span className="font-semibold">Category:</span> {club.category}
                    </div>
                    <div>
                      <span className="font-semibold">Members:</span> {club.members}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold">Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {club.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 py-4 border-t">
        <Button
          className="w-full"
          style={{
            backgroundColor: isJoined ? undefined : club.theme.primaryColor,
            borderColor: club.theme.primaryColor
          }}
          variant={isJoined ? "outline" : "default"}
          onClick={() => onJoin?.(club.id)}
        >
          {isJoined ? 'Joined' : 'Join Club'}
        </Button>
      </CardFooter>
    </Card>
  );
}