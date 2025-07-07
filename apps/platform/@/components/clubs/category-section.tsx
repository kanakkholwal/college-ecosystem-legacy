'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { Club, ClubCategory } from '~/types/clubs';
import { ClubCard } from './club-card';

interface CategorySectionProps {
  category: ClubCategory;
  clubs: Club[];
  onJoinClub?: (clubId: string) => void;
  onViewAll?: (category: ClubCategory) => void;
  joinedClubs?: string[];
}

export function CategorySection({ 
  category, 
  clubs, 
  onJoinClub, 
  onViewAll,
  joinedClubs = []
}: CategorySectionProps) {
  const categoryClubs = clubs.filter(club => club.category === category);
  
  if (categoryClubs.length === 0) return null;

  const displayClubs = categoryClubs.slice(0, 3);

  const getCategoryIcon = (category: ClubCategory) => {
    const icons = {
      'Technical': '💻',
      'Cultural': '🎭',
      'Literary': '📚',
      'Sports': '⚽',
      'Social Service': '🤝',
      'Academic': '🎓',
      'Arts & Crafts': '🎨'
    };
    return icons[category] || '🏆';
  };

  const getCategoryColor = (category: ClubCategory) => {
    const colors = {
      'Technical': 'from-blue-500 to-cyan-500',
      'Cultural': 'from-orange-500 to-red-500',
      'Literary': 'from-purple-500 to-pink-500',
      'Sports': 'from-green-500 to-teal-500',
      'Social Service': 'from-emerald-500 to-green-500',
      'Academic': 'from-indigo-500 to-blue-500',
      'Arts & Crafts': 'from-pink-500 to-rose-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="mb-12">
      <Card className="overflow-hidden">
        <CardHeader className={`bg-gradient-to-r ${getCategoryColor(category)} text-white`}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <span className="text-2xl">{getCategoryIcon(category)}</span>
              {category} Clubs
              <span className="text-sm font-normal opacity-80">
                ({categoryClubs.length} {categoryClubs.length === 1 ? 'club' : 'clubs'})
              </span>
            </CardTitle>
            {categoryClubs.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => onViewAll?.(category)}
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* {displayClubs.map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                onJoin={onJoinClub}
                isJoined={joinedClubs.includes(club.id)}
              />
            ))} */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}