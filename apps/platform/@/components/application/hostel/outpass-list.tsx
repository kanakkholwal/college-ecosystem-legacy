import { Heading } from "@/components/ui/typography";
import { Tickets } from "lucide-react";
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
      <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
        <Heading level={6}>
          <Tickets className="inline-block mr-2 size-4" />
          Last {outPasses.length} OutPass
          {outPasses.length > 0 ? `s` : ""}
        </Heading>
      </div>
      <div className={classNames.container}>
        {outPasses.map((outpass) => (
          <OutpassDetails key={outpass._id} outpass={outpass} />
        ))}
      </div>
    </>
  );
}
