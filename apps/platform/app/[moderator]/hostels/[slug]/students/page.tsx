import EmptyArea from "@/components/common/empty-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, VercelTabsList } from "@/components/ui/tabs";
import { Heading, Paragraph } from "@/components/ui/typography";
import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import { LuBuilding } from "react-icons/lu";
import { getEligibleStudentsForHostel, getHostel, getStudentsByHostelId, importStudentsWithCgpi } from "~/actions/hostel.core";
import { ImportStudents } from "./client";

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

  const students = await getStudentsByHostelId(hostel._id);
  const assignableStudents = await getEligibleStudentsForHostel(hostel._id);
  return (
    <div className="space-y-5 my-2">
      <div className="flex justify-between w-full">
        <div className="w-1/2">
          <Heading level={5}>{hostel.name}</Heading>
          <Paragraph className="capitalize text-sm !mt-0">
            {hostel.gender} Hostel
          </Paragraph>
        </div>
      </div>
      <Separator />
      <Tabs defaultValue="view_students" className="w-full">
        <VercelTabsList
          className="w-full"
          tabs={[
            { id: "view_students", label: "View Students" },
            { id: "assign_students", label: "Assign Students" },
            { id: "import_students", label: "Import Students" },
          ]}
        />
        <div className="mt-4 bg-card p-3 pt-1 rounded-md">
          <TabsContent value="view_students">
            <h6 className="text-sm font-medium">
              View Students
              <Badge size="sm" className="ml-2">
                {students.length} Student(s)
              </Badge>
              </h6>
            <p className="text-xs text-muted-foreground">
              Here you can view the list of students in the hostel.
            </p>
            <Separator className="my-2" />

            <ErrorBoundaryWithSuspense
              fallback={
                <EmptyArea
                  icons={[LuBuilding]}
                  title="No Students Found"
                  description={`No students found in ${hostel.name}`}
                />
              }
              loadingFallback={
                <EmptyArea
                  icons={[LuBuilding]}
                  title="Loading Students..."
                  description={`Fetching students for ${hostel.name}`}
                />
              }
            >
              <div className="border rounded overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Roll No</TableHead>
                      <TableHead className="whitespace-nowrap">Name</TableHead>
                      <TableHead className="whitespace-nowrap">Email</TableHead>
                      <TableHead className="whitespace-nowrap">CGPI</TableHead>
                      <TableHead className="whitespace-nowrap">Banned</TableHead>
                      <TableHead className="whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, rowIndex) => (
                      <TableRow key={rowIndex}>
                        <TableCell className="whitespace-nowrap">
                          {student.rollNumber}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {student.name}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {student.email}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {student.cgpi || "N/A"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {student.banned ?
                            `${student.bannedReason} (Until ${new Date(student.bannedTill || "").toLocaleDateString()})`
                            : "No"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {/* Add action buttons here if needed */}
                          <button className="text-primary hover:underline"  disabled>
                            View Details
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ErrorBoundaryWithSuspense>

          </TabsContent>
          <TabsContent value="assign_students">
            <h6 className="text-sm font-medium">
              Assign Students to Hostel
            </h6>
            <p className="text-xs text-muted-foreground">
              Assign students to the hostel by manually adding them or importing from an Excel file.
            </p>
            <ErrorBoundaryWithSuspense
              fallback={
                <EmptyArea
                  icons={[LuBuilding]}
                  title="No Assignable Students Found"
                  description={`No students available to assign to ${hostel.name}`}
                />
              }
              loadingFallback={
                <EmptyArea
                  icons={[LuBuilding]}
                  title="Loading Assignable Students..."
                  description={`Fetching assignable students for ${hostel.name}`}
                />
              }>
              <div className="mt-4">
                {assignableStudents.map((student) => {
                  return (
                    <div key={student._id} className="p-2 border-b last:border-0">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{student.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {student.email}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Roll Number: {student.rollNumber}
                      </p>
                    </div>
                  );
                })}
              </div>
            </ErrorBoundaryWithSuspense>
          </TabsContent>
          <TabsContent value="import_students">
            <h6 className="text-sm font-medium">Import Students from Excel</h6>
            <p className="text-xs text-muted-foreground">
              Upload an excel file with the students to be imported
            </p>
            <ImportStudents
              importFn={importStudentsWithCgpi.bind(null, hostel._id)}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
