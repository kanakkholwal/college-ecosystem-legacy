"use client";

import { ExcelFileHandler } from "@/components/application/xlsx.control";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ImportExcel() {
  const [extractedKeys, setExtractedKeys] = useState<string[]>([]);
  const [data, setData] = useState<string[][]>([]);

  return (
    <div className="my-5">
      <ExcelFileHandler
        callBackFn={async (data) => {
          console.log(data);
        }}
      />
      {extractedKeys.length > 0 && (
        <div className="flex w-full items-center gap-3 flex-wrap mt-5">
          <div className="grid w-full items-center gap-2.5 grid-cols-1 @lg:grid-cols-3">
            {extractedKeys.map((key) => {
              return (
                <div
                  className="grid w-full max-w-sm items-center gap-1.5"
                  key={key}
                >
                  <Label htmlFor={key}>{key}</Label>

                  <Select onValueChange={(value) => console.log(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={key} />
                    </SelectTrigger>
                    <SelectContent>
                      {data.map((row, rowIndex) => {
                        return (
                          <SelectItem
                            key={`${key}-${rowIndex.toString()}`}
                            value={row[rowIndex]}
                          >
                            {row[rowIndex]}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>

          <div>
            <Button>Process Data</Button>
          </div>
        </div>
      )}
    </div>
  );
}
