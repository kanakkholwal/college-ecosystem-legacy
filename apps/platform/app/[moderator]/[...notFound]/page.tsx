import EmptyArea from "@/components/common/empty-area";
import {
  FileText,
  Files,
  Link
} from "lucide-react";

export const metadata = {
  title: "Not Found",
  description: "The page was not found"
}

interface Props {
  params: Promise<{
    moderator: string[],
    notFound: string[]
  }>;
}

export default async function NotFoundFallbackPage({ params }: Props) {
  const { moderator, notFound } = await params;

  return (
    <div className="space-y-6 my-5 min-h-screen flex flex-col items-center justify-center">

      <EmptyArea
        title="No page found"
        description={<>
          The page <span className="font-bold text-primary p-1 bg-primary/20 rounded-md">{notFound.join("/")}</span> was not found.
        </>}

        icons={[FileText, Link, Files]}
      />
    </div>
  );
}
