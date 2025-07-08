
import { Metadata } from 'next';
import { getAllClubs } from '~/actions/clubs';
import { getSession } from '~/lib/auth-server';
import { appConfig } from '~/project.config';
import ClubsAndSocietiesPageClient from './client';

export const metadata:Metadata = {
  title: 'Clubs and Societies',
  description: 'Explore the various clubs and societies at our institution, fostering community and collaboration among students.',
  openGraph: {
    title: 'Clubs and Societies',
    description: 'Explore the various clubs and societies at our institution, fostering community and collaboration among students.',
    url: '/clubs-and-societies',
    siteName: appConfig.name,
  },
};

export default async function ClubsAndSocietiesPage() {

  const clubs = await getAllClubs()
  return (
    <>
    <ClubsAndSocietiesPageClient clubsList={clubs}/>

    </>
  );
}