'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ClubCategory } from '~/types/clubs';

interface SearchFilterBarProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: ClubCategory | 'all') => void;
  onVerifiedFilter: (verified: boolean) => void;
  onEventFilter: (hasEvents: boolean) => void;
  categories: ClubCategory[];
}

export function SearchFilterBar({
  onSearch,
  onCategoryFilter,
  onVerifiedFilter,
  onEventFilter,
  categories
}: SearchFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [hasEventsOnly, setHasEventsOnly] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleVerifiedToggle = (checked: boolean) => {
    setVerifiedOnly(checked);
    onVerifiedFilter(checked);
  };

  const handleEventsToggle = (checked: boolean) => {
    setHasEventsOnly(checked);
    onEventFilter(checked);
  };

  return (
    <div className="w-full space-y-4 mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search clubs, events, or tags..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <Select onValueChange={(value) => onCategoryFilter(value as ClubCategory | 'all')}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter Options */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="end">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="verified"
                  checked={verifiedOnly}
                  onCheckedChange={handleVerifiedToggle}
                />
                <Label htmlFor="verified" className="text-sm">
                  Verified clubs only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="events"
                  checked={hasEventsOnly}
                  onCheckedChange={handleEventsToggle}
                />
                <Label htmlFor="events" className="text-sm">
                  Clubs with upcoming events
                </Label>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}