import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import { GetFiles } from "src/lib/storage";
import { FileCard } from "./file-card";

interface PageProps {
    searchParams: {
        query?: string;
        offset?: number;
    };
}

export default async function StoragePage({ searchParams }: PageProps) {
    const offset = Number(searchParams.offset) || 1;
    const query = searchParams.query || "";

    const files = await GetFiles({ query, offset });


    return (
        <div className="space-y-6 my-5">

            <ErrorBoundaryWithSuspense loadingFallback={<div>Loading...</div>} fallback={<div>Error loading files</div>}>
                {files.map((file) => {
                    return (
                        <FileCard file={file} key={file._id} />
                    );
                })}
            </ErrorBoundaryWithSuspense>

        </div>
    );
}
