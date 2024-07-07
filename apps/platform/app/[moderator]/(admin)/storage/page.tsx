
interface PageProps {
    searchParams: {
        query?: string;
        offset?: number;
    };
}

export default async function StoragePage({ searchParams }: PageProps) {
    const offset = Number(searchParams.offset) || 1;
    const query = searchParams.query || "";


    return (
        <div className="space-y-6 my-5">

        </div>
    );
}
