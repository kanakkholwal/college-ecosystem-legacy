
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowRight, CheckCircle2, Eye, Sparkles, Users } from 'lucide-react';
import { ClubTypeJson } from '~/models/clubs';
import { ButtonLink } from '../utils/link';

interface ClubCardProps {
  club: ClubTypeJson;
}

export function ClubCard({ club }: ClubCardProps) {

  return (
    <div className="relative group">
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 rounded-xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md`} />

      <Card
        className="relative h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 shadow-sm bg-card/50 hover:bg-card"
        style={{
          borderTop: `3px solid ${club.theme?.primaryColor || 'hsl(var(--primary))'}`,
        }}
  
      >
        <CardContent className="p-6 pb-4">
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="h-14 w-14 border-2" style={{
              borderColor: club.theme?.primaryColor || 'hsl(var(--primary))',
              boxShadow: `0 0 0 3px ${club.theme?.primaryColor}20` || 'hsl(var(--primary)/0.2)'
            }}>
              <AvatarImage src={club.logo} alt={club.name} />
              <AvatarFallback
                className="text-white font-bold"
                style={{
                  backgroundColor: club.theme?.primaryColor || 'hsl(var(--primary))'
                }}
              >
                {club.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg truncate">{club.name}</h3>
                {club.isVerified && (
                  <Badge variant="default_light" className="px-1.5 py-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Verified
                  </Badge>
                )}

              </div>
              <p className="text-sm text-muted-foreground font-medium">{club.tagline}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {club.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span className='whitespace-nowrap'>{club.members} members</span>
              {(new Date(club.establishedYear).getTime() - new Date().getTime()) < 1000 * 60 * 60 * 24 * 30 && (
                <Badge variant="default" className="px-1.5 py-0.5">
                  <Sparkles className="size-3 mr-1" />
                  New
                </Badge>
              )}
            </div>
            {/* {club.nextEvent && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span className="truncate max-w-[120px]">{club.nextEvent.title}</span>
              </div>
            )} */}
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {club.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs font-medium"
                style={{
                  backgroundColor: `${club.theme?.primaryColor || 'hsl(var(--primary))'}15`,
                  color: club.theme?.primaryColor || 'hsl(var(--primary))',
                }}
              >
                {tag}
              </Badge>
            ))}
            {club.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{club.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="px-6 pb-6 pt-0 gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
              >
                <Eye />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={club.logo} alt={club.name} />
                    <AvatarFallback style={{
                      backgroundColor: club.theme?.primaryColor || 'hsl(var(--primary))'
                    }}>
                      {club.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="flex items-center gap-2">
                      {club.name}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">{club.tagline}</p>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                    <p className="capitalize">{club.category}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">Established</h4>
                    <p>{club.establishedYear}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">Members</h4>
                    <p>{club.members}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">President</h4>
                    <p>{club.president.name}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">About</h4>
                  <p className="text-muted-foreground">{club.description}</p>
                </div>

                {club.tags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {club.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          style={{
                            backgroundColor: `${club.theme?.primaryColor || 'hsl(var(--primary))'}15`,
                            color: club.theme?.primaryColor || 'hsl(var(--primary))',
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <ButtonLink
            href={`/clubs/${club.subDomain}`}
            variant="outline"
            className="w-full text-white group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors"
            style={{
              backgroundColor: club.theme?.primaryColor ? club.theme?.primaryColor : 'hsl(var(--primary))',
              borderColor: `${club.theme?.primaryColor ? club.theme?.primaryColor : 'hsl(var(--primary))'}30`,
            }}

          >
            <Eye />
            View Club
            <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </ButtonLink>
        </CardFooter>
      </Card>
    </div>
  );
}