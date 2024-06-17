import { TimeTable } from "@/components/custom/time-table";
import { StoreInitializer } from "@/components/custom/time-table-editor";
import { useTimetableStore } from "@/components/custom/time-table-store";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTimeTable } from "src/lib/time-table/actions";
import { TimeTableWithID } from "src/models/time-table";
// import { getSession } from "src/lib/auth";
// import { sessionType } from "src/types/session";

interface Props {
    params: {
        department_code: string;
        year: number;
        semester: number;
    }
}

export default async function Dashboard({ params }: Props) {
    // const session = await getSession() as sessionType;
    const { department_code, year, semester } = params;
    const timetableData = await getTimeTable(department_code, Number(year), Number(semester));
    if (!timetableData)
        return notFound();

    useTimetableStore.setState({
        timetableData: timetableData as TimeTableWithID,
        isEditing: false,
        editingEvent: {
            dayIndex: 0,
            timeSlotIndex: 0,
            eventIndex: 0
        }
    })

    return (<>
        <div className="flex items-center justify-between gap-2 mx-auto max-w-7xl w-full mt-20">
            <Button variant="default_light" size="sm" asChild>
                <Link href={`/schedules`}>
                    <ArrowLeft />
                    Go Back
                </Link>
            </Button>
        </div>
        <StoreInitializer timetableData={timetableData as TimeTableWithID} isEditing={false} />
        <TimeTable
            // timetableData={timetableData}
            mode="view" />
    </>)
}
