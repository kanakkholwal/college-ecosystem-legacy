// import { RouterCard } from "@/components/common/router-card";
// import { LuBuilding } from "react-icons/lu";
import { getHostelByUser } from "~/actions/hostel";

interface PageProps {
  searchParams: Promise<{
    slug?: string;
  }>;
}

export default async function HostelPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const { success, message, hostel } = await getHostelByUser(searchParams?.slug);



  return (
    <div className="space-y-5">
      <div className="grid w-full @5xl:max-w-6xl grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-4 text-left justify-start gap-4">
        
      </div>
    </div>
  );
}


