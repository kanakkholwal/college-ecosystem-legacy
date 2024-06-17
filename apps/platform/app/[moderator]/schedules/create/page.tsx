import { TimeTable } from "@/components/custom/time-table";
import { StoreInitializer } from "@/components/custom/time-table-editor";
import { useTimetableStore } from "@/components/custom/time-table-store";
import { createTimeTable } from "src/lib/time-table/actions";


export default async function Dashboard() {


    return (<>
        <StoreInitializer timetableData={useTimetableStore.getInitialState().timetableData} isEditing={false} />
        <TimeTable 
        // timetableData={useTimetableStore.getInitialState().timetableData}
         mode="edit" saveTimetable={createTimeTable} />
    </>)
}
