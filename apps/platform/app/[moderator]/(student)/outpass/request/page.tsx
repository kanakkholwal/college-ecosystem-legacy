import RequestOutPassForm from "@/components/application/hostel/outpass-request-form";
import EmptyArea from "@/components/common/empty-area";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/typography";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LuBuilding } from "react-icons/lu";
import { getHostelByUser } from "~/actions/hostel";
import { createOutPass } from "~/actions/hostel_outpass";

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
  const { success, message, hosteler } = await getHostelByUser(slug);

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
      <Button variant="link" size="sm" effect="hoverUnderline" asChild>
        <Link href="/student/outpass">
          <ArrowLeft />
          Go Back
        </Link>
      </Button>
      <Heading level={4}>Request an Outpass</Heading>
      <RequestOutPassForm student={hosteler} onSubmit={createOutPass} />
    </div>
  );
}
