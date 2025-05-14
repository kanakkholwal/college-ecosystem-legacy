import { Heading } from "@/components/ui/typography";
import type { OutPassType } from "~/models/hostel_n_outpass";
import { OutpassDetails } from "./outpass";

interface OutpassListProps {
  outPasses: OutPassType[];
}

const classNames = {
  container:
    "w-full grid grid-cols-1 @lg:grid-cols-2 @2xl:grid-cols-3 @5xl:grid-cols-4 gap-3 p-4",
};

export default function OutpassList({ outPasses }: OutpassListProps) {
  return (
    <>
      <Heading level={4}>Last {outPasses.length} OutPass</Heading>
      <div className={classNames.container}>
        {outPasses.map((outpass) => (
          <OutpassDetails key={outpass._id} outpass={outpass} />
        ))}
      </div>
    </>
  );
}
