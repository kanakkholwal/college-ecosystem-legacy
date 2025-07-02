export interface Club {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  category: ClubCategory;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  members: number;
  isVerified: boolean;
  tags: string[];
  president: {
    name: string;
    email: string;
  };
  established: string;
  nextEvent?: Event;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  clubId: string;
  clubName: string;
  registrationOpen: boolean;
  maxParticipants?: number;
  currentParticipants: number;
  image?: string;
}

export type ClubCategory = 
  | 'Technical'
  | 'Cultural'
  | 'Literary'
  | 'Sports'
  | 'Social Service'
  | 'Academic'
  | 'Arts & Crafts';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'president';
  joinedClubs: string[];
}