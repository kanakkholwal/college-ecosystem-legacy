import EmptyArea from "@/components/common/empty-area";
import { Heading, Paragraph } from "@/components/ui/typography";
import { LuBuilding } from "react-icons/lu";
import { getHostel,importStudentsWithCgpi } from "~/actions/hostel";
import { ImportStudents } from "./client";
import { Separator } from "@/components/ui/separator";

export default async function HostelPage({
    params,
}: {
    params: Promise<{
        slug: string;
    }>;
}) {
    const slug = (await params).slug;
    const response = await getHostel(slug);

    const { success, hostel } = response;

    if (!success || !hostel) {
        return (
            <EmptyArea
                icons={[LuBuilding]}
                title="No Hostel Found"
                description={`Hostel with slug ${slug} not found`}
            />
        );
    }

    return (
        <div className="space-y-5 my-2">
            <div className="flex justify-between w-full">
                <div className="w-1/2">
                    <Heading level={4}>{hostel.name}</Heading>
                    <Paragraph className="capitalize !mt-0">
                        {hostel.gender} Hostel
                    </Paragraph>
                </div>
            </div>
        <Separator/>
        <div>
            <Heading level={6}>
                Import Students from Excel
            </Heading>
            <Paragraph className="!mt-0">
                Upload an excel file with the students to be imported
            </Paragraph>
            <ImportStudents importFn={importStudentsWithCgpi.bind(null,hostel._id)}/>
        </div>

        </div>
    )
}