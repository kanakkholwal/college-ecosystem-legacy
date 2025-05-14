import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import { Separator } from "@radix-ui/react-separator";
import { format } from "date-fns";
import { notFound } from "next/navigation";

import { getOutPassByIdForHosteler } from "~/actions/hostel_outpass";

interface PageProps {
    params: Promise<{
        studentId: string;
    }>;
}

export default async function UpdateUserPage({ params }: PageProps) {
    const outpass = await getOutPassByIdForHosteler((await params).studentId);
    if (!outpass.data) {
        return notFound();
    }


    return (
        <div className="space-y-6 my-5">
            <ErrorBoundaryWithSuspense fallback={<div>Loading...</div>}
                loadingFallback={undefined}>
                <Accordion type="single" collapsible className="w-full relative grid gap-4">

                    {outpass.data.map((pass) => (
                        <AccordionItem value={pass._id} key={pass._id} className="p-3 bg-card shadow rounded-md">
                            <AccordionTrigger className="space-y-1 no-underline hover:no-underline items-center justify-between flex-wrap align-middle gap-3">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {pass.student.name} ({pass.student.rollNumber})
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{pass.student.email}</p>
                                </div>
                                <Badge variant={pass.status === "approved" ? "success" : pass.status === "rejected" ? "destructive" : "secondary"} size="sm">
                                    {pass.status.toUpperCase()}
                                </Badge>
                            </AccordionTrigger>
                            <AccordionContent className="ms-6 mr-4">
                                <Separator />

                                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                    <div>
                                        <p className="font-medium">Hostel:</p>
                                        <p>{pass.hostel.name} ({pass.hostel.gender})</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Room Number:</p>
                                        <p>{pass.roomNumber}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Reason:</p>
                                        <p>{pass.reason}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Address:</p>
                                        <p>{pass.address}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Expected Out:</p>
                                        <p>{format(new Date(pass.expectedOutTime), "dd MMM yyyy hh:mm a")}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Expected In:</p>
                                        <p>{format(new Date(pass.expectedInTime), "dd MMM yyyy hh:mm a")}</p>
                                    </div>
                                    {pass.actualOutTime && (
                                        <div>
                                            <p className="font-medium">Actual Out:</p>
                                            <p>{format(new Date(pass.actualOutTime), "dd MMM yyyy hh:mm a")}</p>
                                        </div>
                                    )}
                                    {pass.actualInTime && (
                                        <div>
                                            <p className="font-medium">Actual In:</p>
                                            <p>{format(new Date(pass.actualInTime), "dd MMM yyyy hh:mm a")}</p>
                                        </div>
                                    )}
                                </div>

                                <p className="text-xs text-right text-muted-foreground  ">
                                    Requested on {format(new Date(pass.createdAt || ""), "dd MMM yyyy, hh:mm a")}
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </ErrorBoundaryWithSuspense>
        </div>
    );
}
