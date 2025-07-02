'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, Calendar, Settings } from 'lucide-react';

interface AdminFabProps {
  isAdmin: boolean;
  onAddClub?: () => void;
  onAddEvent?: () => void;
  onManageMembers?: () => void;
}

export function AdminFab({ isAdmin, onAddClub, onAddEvent, onManageMembers }: AdminFabProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Actions</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => {
                onAddClub?.();
                setIsOpen(false);
              }}
            >
              <Plus className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Add New Club</div>
                <div className="text-sm text-muted-foreground">Create a new club or society</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => {
                onAddEvent?.();
                setIsOpen(false);
              }}
            >
              <Calendar className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Add Event</div>
                <div className="text-sm text-muted-foreground">Schedule a new event</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => {
                onManageMembers?.();
                setIsOpen(false);
              }}
            >
              <Users className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Manage Memberships</div>
                <div className="text-sm text-muted-foreground">Handle member requests</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}