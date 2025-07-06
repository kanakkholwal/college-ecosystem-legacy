
import { getAllClubs } from '~/actions/clubs';
import { getSession } from '~/lib/auth-server';
import ClubsAndSocietiesPageClient from './client';

export default async function ClubsAndSocietiesPage() {
  const session = await getSession();

  const clubs = await getAllClubs()
  return (
    <>
    <ClubsAndSocietiesPageClient recentClubs={clubs}/>

    </>
  );
}