'use client';

import { AdminFab } from '@/components/clubs/admin-fab';
import { CategorySection } from '@/components/clubs/category-section';
import { ClubCard } from '@/components/clubs/club-card';
import { FeaturedCarousel } from '@/components/clubs/featured-carousel';
import { SearchFilterBar } from '@/components/clubs/search-filter-bar';
import { UpcomingEvents } from '@/components/clubs/upcoming-events';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BannerPanel } from '@/components/utils/banner';
import { clubCategories, clubsEventList, clubsList } from '@/constants/clubs';
import { Calendar, Sparkles, Trophy, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { appConfig, orgConfig } from '~/project.config';
import { ClubCategory } from '~/types/clubs';

export default function ClubsAndSocietiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ClubCategory | 'all'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [hasEventsOnly, setHasEventsOnly] = useState(false);
  const [joinedClubs, setJoinedClubs] = useState<string[]>([]);

  // Mock user state - in real app, this would come from auth context
  const [user] = useState({
    isAdmin: true, // Set to false to hide admin controls
    name: 'John Doe',
    email: 'john.doe@nith.ac.in'
  });

  const filteredClubs = useMemo(() => {
    return clubsList.filter(club => {
      const matchesSearch =
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || club.category === selectedCategory;
      const matchesVerified = !verifiedOnly || club.isVerified;
      const matchesEvents = !hasEventsOnly || club.nextEvent !== undefined;

      return matchesSearch && matchesCategory && matchesVerified && matchesEvents;
    });
  }, [searchQuery, selectedCategory, verifiedOnly, hasEventsOnly]);

  const handleJoinClub = (clubId: string) => {
    setJoinedClubs(prev =>
      prev.includes(clubId)
        ? prev.filter(id => id !== clubId)
        : [...prev, clubId]
    );
  };

  const handleEventRegister = (eventId: string) => {
    // Handle event registration logic
    console.log('Registering for event:', eventId);
  };

  const stats = {
    totalClubs: clubsList.length,
    totalMembers: clubsList.reduce((acc, club) => acc + club.members, 0),
    upcomingEvents: clubsEventList.length,
    categories: clubCategories.length
  };

  return (
    <div className="min-h-screen">
      <BannerPanel
      className='mt-5 rounded-2xl'
        title="Preview of the Clubs & Societies Feature with Sample Data"
        description="We are working on having online presence and activities of non-technical clubs too and have their customizable website "
        redirectUrl={appConfig.githubRepo}
        isClosable={false}
        btnProps={{
          children: 'Contribute on GitHub',
          variant:"rainbow"
        }}
      />
      {/* Header */}
      <div className="bg-card border-b  mt-8 z-40 rounded-2xl backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-sky-500 hover:from-sky-500 hover:to-primary  bg-clip-text text-transparent">
                Clubs & Societies @{orgConfig.shortName}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore, join, and contribute to the vibrant club ecosystem at our institute
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-6">
              <div className="flex items-center gap-2 text-sm">
                <Users className="size-4 text-secondary" />
                <span className="font-semibold">{stats.totalMembers.toLocaleString()}</span>
                <span className="text-muted-foreground">members</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="size-4 text-purple-600" />
                <span className="font-semibold">{stats.totalClubs}</span>
                <span className="text-muted-foreground">active clubs</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-green-600" />
                <span className="font-semibold">{stats.upcomingEvents}</span>
                <span className="text-muted-foreground">upcoming events</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search and Filters */}
            <SearchFilterBar
              onSearch={setSearchQuery}
              onCategoryFilter={setSelectedCategory}
              onVerifiedFilter={setVerifiedOnly}
              onEventFilter={setHasEventsOnly}
              categories={clubCategories}
            />

            {/* Featured Carousel */}
            {!searchQuery && selectedCategory === 'all' && !verifiedOnly && !hasEventsOnly && (
              <FeaturedCarousel
                clubs={clubsList}
                onJoinClub={handleJoinClub}
                onViewEvents={(clubId) => console.log('View events for:', clubId)}
              />
            )}

            {/* Category Sections or Filtered Results */}
            {searchQuery || selectedCategory !== 'all' || verifiedOnly || hasEventsOnly ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    {searchQuery ? `Search Results` :
                      selectedCategory !== 'all' ? `${selectedCategory} Clubs` :
                        'Filtered Clubs'}
                  </h2>
                  <Badge variant="secondary">
                    {filteredClubs.length} {filteredClubs.length === 1 ? 'club' : 'clubs'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredClubs.map((club) => (
                    <ClubCard
                      key={club.id}
                      club={club}
                      onJoin={handleJoinClub}
                      isJoined={joinedClubs.includes(club.id)}
                    />
                  ))}
                </div>

                {filteredClubs.length === 0 && (
                  <Card className="text-center py-12">
                    <CardContent>
                      <div className="text-muted-foreground mb-4">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No clubs found matching your criteria</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                          setVerifiedOnly(false);
                          setHasEventsOnly(false);
                        }}
                      >
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {clubCategories.map((category) => (
                  <CategorySection
                    key={category}
                    category={category}
                    clubs={clubsList}
                    onJoinClub={handleJoinClub}
                    joinedClubs={joinedClubs}
                    onViewAll={(category) => setSelectedCategory(category)}
                  />
                ))}
              </div>
            )}

            {/* Call to Action */}
            {!searchQuery && selectedCategory === 'all' && (
              <Card className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="text-center py-12">
                  <h3 className="text-2xl font-bold mb-4">Want to Start a New Club?</h3>
                  <p className="text-lg mb-6 opacity-90">
                    Have an idea for a new club or society? Submit your proposal and bring your vision to life!
                  </p>
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Apply to Create Club
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            <UpcomingEvents
              events={clubsEventList}
              onRegister={handleEventRegister}
            />

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Platform Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Clubs</span>
                  <Badge variant="secondary">{stats.totalClubs}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Members</span>
                  <Badge variant="secondary">{stats.totalMembers.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Categories</span>
                  <Badge variant="secondary">{stats.categories}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Upcoming Events</span>
                  <Badge variant="secondary">{stats.upcomingEvents}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Admin Controls */}
      <AdminFab
        isAdmin={user.isAdmin}
        onAddClub={() => console.log('Add club')}
        onAddEvent={() => console.log('Add event')}
        onManageMembers={() => console.log('Manage members')}
      />
    </div>
  );
}