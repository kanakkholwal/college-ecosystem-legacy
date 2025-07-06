'use client';

import { AdminFab } from '@/components/clubs/admin-fab';
import { ClubCard } from '@/components/clubs/club-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { clubCategories, clubsEventList, clubsList } from '@/constants/clubs';
import { ChevronRight, Filter, Sparkles, Users } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useMemo, useState } from 'react';
import { ClubTypeJson } from '~/models/clubs';
import { orgConfig } from '~/project.config';

interface ClubsAndSocietiesPageClientProps {
    recentClubs: ClubTypeJson[]; // Replace with actual type if available
}

export default function ClubsAndSocietiesPageClient({ recentClubs }: ClubsAndSocietiesPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useQueryState(
    'all',
    parseAsString.withDefault('all').withOptions({
    })
  );
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'new'>('all');

  // Mock user state - in real app, this would come from auth context
  const [user] = useState({
    isAdmin: true, // Set to false to hide admin controls
    name: 'John Doe',
    email: 'john.doe@nith.ac.in'
  });

  const stats = {
    totalClubs: clubsList.length,
    totalMembers: clubsList.reduce((acc, club) => acc + club.members, 0),
    upcomingEvents: clubsEventList.length,
    categories: clubCategories.length
  };

  const filteredClubs = useMemo(() => {
    if (selectedCategory === 'all') return clubsList;

    return clubsList.filter(club => club.category === selectedCategory);
  }, [selectedCategory]);

  const featuredClubs = useMemo(() => clubsList.filter(club => club.category === 'Technical'), []);
  const newClubs = useMemo(() => clubsList.filter(club => club.category === 'Academic'), []);

  const currentClubs = activeTab === 'all'
    ? filteredClubs
    : activeTab === 'featured'
      ? featuredClubs
      : newClubs;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with full-width background */}
      <div className="relative w-full overflow-hidden">
        {/* Background that extends full width */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background w-screen -left-[calc(50vw-50%)] -right-[calc(50vw-50%)] shadow-[0_0_0_100vmax_rgba(var(--primary)/0.1)]" />

        {/* Content container with max-width */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center gap-3 px-4 py-2 bg-primary/10 rounded-full border">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Explore Campus Life</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Clubs & Societies
              </span>
              <br />
              <span className="text-foreground">@{orgConfig.shortName}</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover, connect, and engage with {stats.totalClubs}+ student organizations
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-primary">{stats.totalClubs}</div>
                <div className="text-sm text-muted-foreground">Active Clubs</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-secondary">{stats.totalMembers}</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-purple-500">{stats.upcomingEvents}</div>
                <div className="text-sm text-muted-foreground">Upcoming Events</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold">Browse Organizations</h2>

            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                placeholder="Filter categories..."
                className="pl-10 w-full md:w-64"
                onChange={(e) => {
                  const value = e.target.value.toLowerCase();
                  if (!value) setSelectedCategory('all');
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {clubCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Clubs Display */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Clubs</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="new">Recently Added</TabsTrigger>
          </TabsList>

          <Separator className="my-4" />

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* {currentClubs.map((club) => (
                <ClubCard key={club.id} club={club } />
              ))} */}
            </div>

            {currentClubs.length === 0 && (
              <div className="text-center py-12 space-y-4">
                <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium">No clubs found</h3>
                <p className="text-muted-foreground">Try selecting a different category</p>
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory('all')}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="featured">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* {featuredClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))} */}
            </div>
          </TabsContent>

          <TabsContent value="new">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentClubs?.map((club) => (
                <ClubCard key={club._id} club={club} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Upcoming Events Section */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <Button variant="ghost" className="text-primary">
              View all <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubsEventList.slice(0, 3).map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{event.clubName}</Badge>
                    <div className="text-sm text-muted-foreground">
                      {event.date}
                    </div>
                  </div>
                  <CardTitle className="mt-2">{event.time}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                  <Button variant="link" className="px-0 mt-3">
                    Learn more
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-16 relative  py-16 bg-gradient-to-r from-card via-primary/50 to-card rounded-xl p-8 text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')]"></div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Want to start your own club?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Bring your passion to life by creating a new student organization. We'll help you with the process!
          </p>
          <Button size="lg">Apply to Create a Club</Button>
        </section>
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