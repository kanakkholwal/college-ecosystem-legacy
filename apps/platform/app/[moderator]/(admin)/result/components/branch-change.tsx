"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConditionalRender from "@/components/utils/conditional-render";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { getYear, isValidRollNumber } from "src/constants/result";
import type { ResultTypeWithId } from "src/models/result";

const getResult = async (rollNo: string) => {
  try {
    const res = await axios.post(`/api/result?rollNo=${rollNo}`);
    return res.data.data as ResultTypeWithId;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default function BranchChanger() {
  const [rollNo, setRollNo] = useState("");
  const [result, setResult] = useState<ResultTypeWithId | null>(null);
  const [newData, setNewData] = useState<Partial<ResultTypeWithId> | null>(
    null
  );

  return (
    <>
      <h3 className="text-lg font-bold">Change Result Data</h3>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Enter Roll No"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
        />
        <Button
          disabled={!isValidRollNumber(rollNo)}
          onClick={async () => {
            setResult(null);
            toast.promise(getResult(rollNo), {
              loading: "Fetching Result...",
              success: (data) => {
                console.log(data);
                setResult(data);
                return "Result Fetched";
              },
              error: "Failed to fetch result",
            });
          }}
        >
          Get Result
        </Button>
      </div>
      <ConditionalRender condition={result !== null}>
        <div className="lg:w-3/4 text-center mx-auto mt-10">
          <h1 className="text-gray-900 dark:text-white font-bold text-3xl">
            <span className="relative bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent md:px-2">
              {result?.name}
            </span>
          </h1>
          <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-center mx-auto uppercase">
            {result?.rollNo}
          </h5>
          <div className="flex flex-wrap justify-center gap-y-4 gap-x-6">
            <div className="w-full flex flex-wrap items-center gap-4 text-sm mx-auto justify-center">
              <span
                className={"bg-primary/10 text-primary py-1.5 px-3 rounded-md"}
              >
                {result && getYear(result)}
              </span>
              <span
                className={"bg-primary/10 text-primary py-1.5 px-3 rounded-md"}
              >
                {result?.branch}
              </span>
              <span
                className={"bg-primary/10 text-primary py-1.5 px-3 rounded-md"}
              >
                {result?.programme}
              </span>
            </div>
          </div>
          <div className="flex gap-4 items-center" />
        </div>
      </ConditionalRender>
    </>
  );
}
