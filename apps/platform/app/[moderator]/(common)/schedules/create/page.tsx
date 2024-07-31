import { GoBackButton } from "@/components/common/go-back";
import { TimeTableEditor } from "@/components/custom/time-table";

export default async function CreateTimeTablePage() {
  return (
    <>
    <GoBackButton/>
      <TimeTableEditor mode="create" />
    </>
  );
}
