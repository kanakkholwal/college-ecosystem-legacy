import { Club, ClubCategory, Event } from '~/types/clubs';

export const clubsEventList: Event[] = [
  {
    id: '1',
    title: 'AI Workshop 2024',
    description: 'Hands-on machine learning workshop',
    date: '2024-02-15',
    time: '10:00 AM',
    venue: 'Tech Lab A',
    clubId: '1',
    clubName: 'CodeHub',
    registrationOpen: true,
    maxParticipants: 50,
    currentParticipants: 32,
    image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    title: 'Annual Cultural Fest',
    description: 'Celebrating diversity through art and culture',
    date: '2024-02-20',
    time: '6:00 PM',
    venue: 'Main Auditorium',
    clubId: '2',
    clubName: 'Cultural Society',
    registrationOpen: true,
    currentParticipants: 156,
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    title: 'Poetry Slam Night',
    description: 'Express yourself through spoken word',
    date: '2024-02-18',
    time: '7:30 PM',
    venue: 'Literary Hall',
    clubId: '3',
    clubName: 'Writers Guild',
    registrationOpen: true,
    maxParticipants: 30,
    currentParticipants: 18,
    image: 'https://images.pexels.com/photos/159581/dictionary-reference-book-learning-meaning-159581.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
];

export const clubsList: Club[] = [
  {
    id: '1',
    name: 'CodeHub',
    tagline: 'Code, Learn, Innovate',
    description: 'A community of developers passionate about creating impactful solutions through code.',
    logo: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Technical',
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF'
    },
    members: 245,
    isVerified: true,
    tags: ['Programming', 'Web Development', 'AI/ML', 'Open Source'],
    president: {
      name: 'Alex Chen',
      email: 'alex.chen@nith.ac.in'
    },
    established: '2019',
    nextEvent: clubsEventList[0]
  },
  {
    id: '2',
    name: 'Cultural Society',
    tagline: 'Celebrating Diversity Through Art',
    description: 'Promoting cultural awareness and artistic expression across all forms of creative arts.',
    logo: 'https://images.pexels.com/photos/3618162/pexels-photo-3618162.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Cultural',
    theme: {
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706'
    },
    members: 312,
    isVerified: true,
    tags: ['Dance', 'Music', 'Theatre', 'Art'],
    president: {
      name: 'Priya Sharma',
      email: 'priya.sharma@nith.ac.in'
    },
    established: '2015',
    nextEvent: clubsEventList[1]
  },
  {
    id: '3',
    name: 'Writers Guild',
    tagline: 'Words That Inspire',
    description: 'A haven for writers, poets, and storytellers to hone their craft and share their voice.',
    logo: 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Literary',
    theme: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#7C3AED'
    },
    members: 128,
    isVerified: true,
    tags: ['Creative Writing', 'Poetry', 'Journalism', 'Blogging'],
    president: {
      name: 'Rahul Verma',
      email: 'rahul.verma@nith.ac.in'
    },
    established: '2018',
    nextEvent: clubsEventList[2]
  },
  {
    id: '4',
    name: 'Green Earth Initiative',
    tagline: 'Sustaining Tomorrow',
    description: 'Environmental awareness and sustainability advocacy through community action.',
    logo: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Social Service',
    theme: {
      primaryColor: '#10B981',
      secondaryColor: '#059669'
    },
    members: 89,
    isVerified: true,
    tags: ['Environment', 'Sustainability', 'Community Service'],
    president: {
      name: 'Maya Gupta',
      email: 'maya.gupta@nith.ac.in'
    },
    established: '2020'
  },
  {
    id: '5',
    name: 'Robotics Club',
    tagline: 'Building the Future',
    description: 'Designing and building autonomous robots for competitions and real-world applications.',
    logo: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Technical',
    theme: {
      primaryColor: '#EF4444',
      secondaryColor: '#DC2626'
    },
    members: 156,
    isVerified: true,
    tags: ['Robotics', 'Automation', 'Engineering', 'Competitions'],
    president: {
      name: 'Arjun Patel',
      email: 'arjun.patel@nith.ac.in'
    },
    established: '2017'
  },
  {
    id: '6',
    name: 'Photography Club',
    tagline: 'Capturing Moments',
    description: 'Visual storytelling through the lens, exploring different photography techniques and styles.',
    logo: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=100',
    category: 'Arts & Crafts',
    theme: {
      primaryColor: '#06B6D4',
      secondaryColor: '#0891B2'
    },
    members: 203,
    isVerified: true,
    tags: ['Photography', 'Visual Arts', 'Digital Art'],
    president: {
      name: 'Ananya Roy',
      email: 'ananya.roy@nith.ac.in'
    },
    established: '2016'
  }
];

export const clubCategories: ClubCategory[] = [
  'Technical',
  'Cultural',
  'Literary',
  'Sports',
  'Social Service',
  'Academic',
  'Arts & Crafts'
];