"use client"
import { GoBackButton } from "@/components/common/go-back";
import Scheduler from "@/components/extended/scheduler";

export default function CreateTimeTablePage() {
  return (
    <>
      <GoBackButton />
      <Scheduler 
        events={[]}
        setEvents={() => {}}
        mode="day"
        setMode={() => {}}
        date={new Date()}
        setDate={() => {}}
      />
    </>
  );
}
