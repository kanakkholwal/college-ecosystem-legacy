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

// types/club.ts

export type ClubTheme = {
  primaryColor: string; // e.g., "#1e293b"
  secondaryColor: string; // e.g., "#facc15"
  font: string; // tailwind font class like "font-sans"
  borderRadius?: string;
  customCSS?: string;
};

export type ClubComponentData = {
  hero?: {
    title: string;
    description: string;
  };
  about?: {
    title: string;
    description: string;
  };
  events?: {
    events: {
      title: string;
      date: string;
      desc: string;
    }[];
  };
  [key: string]: any; // For extension like team, gallery, etc.
};

export type ClubSections = {
  order: string[];
  visibility: Record<string, boolean>;
};

export type ClubCustomizationConfig = {
  layout: 'layout-one' | 'layout-two'; // Extend with more layouts as needed
  theme: ClubTheme;
  sections: ClubSections;
  componentsData: ClubComponentData;
}