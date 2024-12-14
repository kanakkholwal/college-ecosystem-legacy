import { UploadImage } from "@/components/utils/uploader";

interface PageProps {
  searchParams: Promise<{
    query?: string;
    offset?: number;
  }>
}

export default async function StoragePage(props: PageProps) {
  const searchParams = await props.searchParams;
  const offset = Number(searchParams.offset) || 1;
  const query = searchParams.query || "";

  return (
    <div className="space-y-6 my-5">
      <h1 className="text-2xl font-semibold text-center">
        Storage Upload (Admin Only)
      </h1>
      <UploadImage />
    </div>
  );
}
