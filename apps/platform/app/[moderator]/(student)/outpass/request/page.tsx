import RequestOutPassForm from "@/components/application/hostel/outpass-request-form";
import EmptyArea from "@/components/common/empty-area";
import { ButtonLink } from "@/components/utils/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { LuBuilding } from "react-icons/lu";
import { getHostelForStudent } from "~/actions/hostel.core";
import { createOutPass } from "~/actions/hostel.outpass";

interface PageProps {
  searchParams: Promise<{
    slug?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Outpass form",
  description: "Fill the outpass form to get an outpass",
};

export default async function RequestOutPassPage(props: PageProps) {
  const { slug } = await props.searchParams;
  const { success, message, hosteler } = await getHostelForStudent(slug);

  if (!success || !hosteler) {
    return (
      <EmptyArea
        icons={[LuBuilding]}
        title="No Hostel Found for this user"
        description={message}
      />
    );
  }

  // console.dir(hosteler, { depth: null });

  return (
    <div className="space-y-3 my-2">
      <ButtonLink variant="outline" size="sm" effect="shineHover"  href="/student/outpass">
          <ArrowLeft />
          Go Back
      </ButtonLink>
      <RequestOutPassForm student={hosteler} onSubmit={createOutPass} />
    </div>
  );
}
