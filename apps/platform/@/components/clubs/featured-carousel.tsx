'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Club } from '~/types/clubs';

interface FeaturedCarouselProps {
  clubs: Club[];
  onJoinClub?: (clubId: string) => void;
  onViewEvents?: (clubId: string) => void;
}

export function FeaturedCarousel({ clubs, onJoinClub, onViewEvents }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const featuredClubs = clubs.filter(club => club.isVerified).slice(0, 3);

  useEffect(() => {
    if (!isAutoPlaying || featuredClubs.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredClubs.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredClubs.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredClubs.length) % featuredClubs.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredClubs.length);
    setIsAutoPlaying(false);
  };

  if (featuredClubs.length === 0) return null;

  const currentClub = featuredClubs[currentIndex];

  return (
    <div className="relative mb-12">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div 
            className="relative min-h-96 py-16 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white"
            style={{
              background: `linear-gradient(135deg, ${currentClub.theme.primaryColor}, ${currentClub.theme.secondaryColor})`
            }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')]"></div>
            </div>

            <div className="relative z-10 text-center max-w-4xl mx-auto px-8">
              <div className="flex justify-center mb-4">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold bg-white/20 backdrop-blur-sm border-2 border-white/30"
                >
                  {currentClub.name.slice(0, 2).toUpperCase()}
                </div>
              </div>
              
              <Badge className="bg-white/20 text-white mb-4">
                Featured Club
              </Badge>
              
              <h2 className="text-4xl font-bold mb-2">{currentClub.name}</h2>
              <p className="text-xl mb-4 opacity-90">{currentClub.tagline}</p>
              <p className="text-lg mb-6 opacity-80 max-w-2xl mx-auto">
                {currentClub.description}
              </p>
              
              <div className="flex items-center justify-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{currentClub.members} members</span>
                </div>
                {currentClub.nextEvent && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{currentClub.nextEvent.title}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center gap-4">
                <Button 
                  size="lg" 
                  variant="light"
                  onClick={() => onJoinClub?.(currentClub.id)}
                >
                  Join Club
                </Button>
                {currentClub.nextEvent && (
                  <Button 
                    size="lg" 
                    variant="dark" 
                    onClick={() => onViewEvents?.(currentClub.id)}
                  >
                    View Events
                  </Button>
                )}
              </div>
            </div>

            {/* Navigation arrows */}
            {featuredClubs.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>

          {/* Dots indicator */}
          {featuredClubs.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {featuredClubs.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}