// app/page.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  FlaskConical,
  GraduationCap,
  Library,
  Newspaper,
  Users
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Slider from './layouts/slider';

export default function Home() {
  const announcements = [
    { id: 1, title: 'Academic Calendar 2023-24 Released', date: '15 Jun 2023', link: '#' },
    { id: 2, title: 'Campus Recruitment Drive - Microsoft', date: '10 Jun 2023', link: '#' },
    { id: 3, title: 'Summer Internship Program Applications Open', date: '5 Jun 2023', link: '#' },
  ];

  const quickLinks = [
    { icon: <GraduationCap size={20} />, title: 'Academics', link: '#' },
    { icon: <FlaskConical size={20} />, title: 'Research', link: '#' },
    { icon: <Users size={20} />, title: 'Admissions', link: '#' },
    { icon: <BookOpen size={20} />, title: 'Examinations', link: '#' },
    { icon: <Library size={20} />, title: 'Library', link: '#' },
    { icon: <Newspaper size={20} />, title: 'News & Events', link: '#' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative h-96 rounded-lg overflow-hidden mb-12">
        <Slider />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white max-w-2xl px-4">
            <h1 className="text-4xl font-bold mb-4">National Institute of Technology Hamirpur</h1>
            <p className="text-xl mb-6">
              Excellence in Technical Education and Research since 1986
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="default">
                <Link href="https://app.nith.eu.org">
                  Go to App
                  <ArrowUpRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.link}
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-primary rounded-lg shadow-xs hover:shadow-md transition-shadow  border "
            >
              <div className="text-primary dark:text-white mb-2">{link.icon}</div>
              <span className="font-medium text-center text-primary dark:text-white">{link.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Announcements and Events */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Announcements */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-primary flex items-center gap-2">
              <Newspaper className="text-primary" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {announcements.map((item) => (
                <li key={item.id} className="p-4 hover:bg-gray-50">
                  <Link href={item.link} className="block">
                    <p className="font-medium mb-1">{item.title}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar size={14} />
                      {item.date}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="p-4 text-center border-t">
              <Button variant="link" className="text-primary">
                View All Announcements <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Events */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-primary flex items-center gap-2">
              <Calendar className="text-primary" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6 text-center">
              <Image
                src="https://nith.ac.in/uploads/events/16813727767252.jpg"
                alt="Upcoming Event"
                width={300}
                height={200}
                className="mx-auto mb-4 rounded"
              />
              <h3 className="font-bold text-lg mb-2">TechFest 2023</h3>
              <p className="text-gray-600 mb-3">June 25-27, 2023</p>
              <Button asChild>
                <Link href="#">View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Director's Message */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-primary">Director's Message</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Image
                src="https://nith.ac.in/uploads/director/16813727767252.jpg"
                alt="Director"
                width={80}
                height={80}
                className="rounded-full"
              />
              <div>
                <h4 className="font-bold">Prof. XYZ</h4>
                <p className="text-sm text-gray-600">Director, NIT Hamirpur</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 line-clamp-4">
              It gives me immense pleasure to welcome you to National Institute of Technology Hamirpur...
            </p>
            <Button variant="link" className="text-primary p-0">
              Read More <ArrowRight size={16} className="ml-1" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Highlights Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-secondary border-b pb-2">Institute Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">32+</div>
              <h3 className="font-medium mb-2">Academic Programs</h3>
              <p className="text-gray-600">UG, PG and Doctoral programs across disciplines</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">150+</div>
              <h3 className="font-medium mb-2">Faculty Members</h3>
              <p className="text-gray-600">Highly qualified and experienced faculty</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">90%+</div>
              <h3 className="font-medium mb-2">Placement Rate</h3>
              <p className="text-gray-600">Consistent high placement records</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <h3 className="font-medium mb-2">Research Labs</h3>
              <p className="text-gray-600">State-of-the-art research facilities</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* News Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-secondary border-b pb-2">Latest News</h2>
          <Button variant="link" className="text-primary">
            View All News <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="hover:shadow-lg transition-shadow">
              <Image
                src={`https://nith.ac.in/uploads/news/${item}.jpg`}
                alt="News"
                width={400}
                height={250}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardContent className="p-6">
                <div className="text-sm text-gray-500 mb-2">15 Jun 2023</div>
                <h3 className="font-bold mb-2">NITH Team Wins National Robotics Competition</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Our student team secured first position in the national level robotics competition held at IIT Delhi.
                </p>
                <Button variant="link" className="text-primary p-0">
                  Read More <ArrowRight size={16} className="ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}