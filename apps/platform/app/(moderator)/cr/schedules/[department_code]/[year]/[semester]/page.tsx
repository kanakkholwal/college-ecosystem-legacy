import { TimeTable } from "@/components/custom/time-table";
import { StoreInitializer } from "@/components/custom/time-table-editor";
import { useTimetableStore } from "@/components/custom/time-table-store";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDepartmentName } from "src/constants/departments";
import { getSession } from "src/lib/auth";
import { getTimeTable, updateTimeTable } from "src/lib/time-table/actions";
import { TimeTableWithID } from "src/models/time-table";
import { sessionType } from "src/types/session";

interface Props {
    params: {
        department_code: string;
        year: number;
        semester: number;
    }
}
const super_access = ["admin", "moderator"];

export default async function Dashboard({ params }: Props) {
    const session = await getSession() as sessionType;
    const { department_code, year, semester } = params;
    const timetableData = await getTimeTable(department_code, Number(year), Number(semester));
    if (!timetableData)
        return notFound();

    if (super_access.some(role => session.user.roles.includes(role)) === false) {
        if (getDepartmentName(department_code) !== session.user.department) {
            console.log("Department code mismatch");
            return notFound();
        }
    }


    useTimetableStore.setState({
        timetableData: timetableData as TimeTableWithID,
        isEditing: true,
        editingEvent: {
            dayIndex: 0,
            timeSlotIndex: 0,
            eventIndex: 0
        }
    })

    return (<>
        <div className="flex items-center justify-between gap-2 mx-auto max-w-7xl w-full mt-20">
            <Button variant="default_light" size="sm" asChild>
                <Link href={`/cr/schedules`}>
                    <ArrowLeft />
                    Go Back
                </Link>
            </Button>
        </div>
        <StoreInitializer timetableData={useTimetableStore.getInitialState().timetableData} isEditing={false} />
        <TimeTable 
            // timetableData={useTimetableStore.getInitialState().timetableData} 
            mode="edit"
            saveTimetable={updateTimeTable.bind(null, timetableData._id!)}
        />
    </>)
}
