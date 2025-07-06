

import { notFound } from "next/navigation";
import { getClubById } from "~/actions/clubs";
import EditClubsForm from "./client";

interface EditClubPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditClubPage(props: EditClubPageProps) {
    // Extracting club ID from params
    const { id } = await props.params;
    const club = await getClubById(id);
    if (!club) {
        notFound();
    }



    return (<EditClubsForm club={club} />
    );
}
