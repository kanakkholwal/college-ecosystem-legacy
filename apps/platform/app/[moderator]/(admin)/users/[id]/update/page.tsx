import { notFound } from "next/navigation";
import { getUser } from "src/lib/users/actions";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function UpdateUserPage({ params }: PageProps) {
    const user = await getUser(params.id);
    if (!user) {
        return notFound();
    }

    return (
        <div className="space-y-6 my-5">
            <div className="container mx-auto py-10 px-2">
            </div>
        </div>
    );
}
