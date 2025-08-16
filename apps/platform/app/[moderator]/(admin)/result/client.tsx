"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { rollNoSchema } from "~/types/result";

import { ResultCard } from "@/components/application/result-display";
import { ResponsiveContainer } from "@/components/common/container";
import EmptyArea from "@/components/common/empty-area";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { LoaderCircleIcon } from "lucide-react";
import toast from "react-hot-toast";
import z from "zod";
import { emailSchema } from "~/constants";
import serverApis from "~/lib/server-apis/client";
import type {
  AbNormalResult,
  ResultType,
  rawResultSchemaType,
} from "~/lib/server-apis/types";
import { orgConfig } from "~/project.config";
import { changeCase } from "~/utils/string";
import { sendMailUpdate } from "./actions";

const availableMethods = [
  "getResultByRollNoFromSite",
  "getResultByRollNo",
  "addResultByRollNo",
  "updateResultByRollNo",
] as const;

async function getResultByRollNo(
  rollNo: string,
  method: (typeof availableMethods)[number]
) {
  try {
    if (method === "getResultByRollNoFromSite") {
      const res = await serverApis.results.getResultByRollNoFromSite(rollNo);
      console.log("Response from getResultByRollNoFromSite:", res);
      return Promise.resolve(res);
    } else if (method === "getResultByRollNo") {
      const response = await serverApis.results.getResultByRollNo(rollNo);
      return Promise.resolve(response);
    } else if (method === "addResultByRollNo") {
      const response = await serverApis.results.addResultByRollNo(rollNo);
      return Promise.resolve(response);
    } else if (method === "updateResultByRollNo") {
      const response = await serverApis.results.updateResultByRollNo([
        rollNo,
        {},
      ]);
      return Promise.resolve(response);
    }
  } catch (err) {
    console.log(err);
    return Promise.reject("Failed to fetch result by roll number");
  }
}

export function GetResultDiv() {
  const [rollNo, setRollNo] = useState<string>("");
  const [method, setMethod] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<rawResultSchemaType | ResultType | null>(
    null
  );

  const handleGetResult = async () => {
    if (!rollNoSchema.safeParse(rollNo).success) {
      toast.error("Invalid Roll No");
      return;
    }
    if (!method) {
      toast.error("Please select a method");
      return;
    }
    if (
      !availableMethods.includes(method as (typeof availableMethods)[number])
    ) {
      toast.error("Invalid method selected");
      return;
    }
    setLoading(true);
    try {
      const response = await getResultByRollNo(
        rollNo,
        method as (typeof availableMethods)[number]
      );
      if (response?.error || !response?.data) {
        toast.error(response?.message || "Failed to fetch result");
        return;
      }
      // Set the result based on the method
      if (response.data) {
        setResult(response.data);
      } else {
        setResult(null);
      }
      console.log(`Result fetched using ${method}:`, response.data);
      // If the result is not null, it means we have successfully fetched the result
      toast.success(
        `Result fetched successfully using ${changeCase(method, "camel_to_title")}`
      );
    } catch (error) {
      console.log(`Error in ${method}:`, error);
      toast.error("An unexpected error occurred while fetching the result.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <Label className="text-xs" htmlFor="rollNo">
          Enter Roll No to Get Result
        </Label>
        <Input
          type="text"
          id="rollNo"
          name="rollNo"
          placeholder="Enter Roll No"
          className="w-full max-w-xs"
          value={rollNo}
          custom-size="sm"
          onChange={(e) => setRollNo(e.target.value)}
          disabled={loading}
          aria-label="Roll No"
        />
      </div>
      <div className="flex gap-1.5 items-center justify-center">
        <Select
          value={method}
          onValueChange={(value) => setMethod(value)}
          disabled={loading}
          aria-label="Select Method"
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            {availableMethods.map((method) => (
              <SelectItem key={method} value={method}>
                {changeCase(method, "camel_to_title")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size="sm"
          variant="default_light"
          disabled={!rollNo || !method || loading}
          onClick={handleGetResult}
          aria-label="Get Result"
        >
          {loading ? "Fetching..." : " Get Result"}
        </Button>
      </div>
      {result && (
        <ResponsiveDialog
          btnProps={{
            variant: "default_light",
            size: "sm",
            children: "View Result",
          }}
          title="Result Details"
          description="View the result details fetched from the server."
          onOpenChange={(open) => {
            if (!open) setResult(null);
          }}
        >
          <ResultCard result={result} />
        </ResponsiveDialog>
      )}
    </div>
  );
}

export function DeleteResultDiv() {
  const [rollNo, setRollNo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [method, setMethod] = useState<string>("rollNo");

  const handleDeleteResult = async () => {
    if (!rollNoSchema.safeParse(rollNo).success) {
      toast.error("Invalid Roll No");
      return;
    }
    setLoading(true);
    try {
      const response = await serverApis.results.deleteResultByRollNo(rollNo);
      if (response?.error || !response?.data) {
        toast.error(response?.message || "Failed to delete result by Roll No");
        return;
      }
      toast.success(
        `${response.data.deletedCount} result(s) deleted successfully`
      );
      setRollNo(""); // Clear the input after successful deletion
    } catch (error) {
      console.log("Error deleting result:", error);
      toast.error("An unexpected error occurred while deleting the result.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 @3xl:p-3">
      <div>
        <Label className="text-xs" htmlFor="rollNoDel">
          Enter Roll No to Delete Result
        </Label>
        <Input
          type="text"
          id="rollNoDel"
          name="rollNoDel"
          placeholder={method === "rollNo" ? "Enter Roll No" : "Enter Batch"}
          className="w-full max-w-xs"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          custom-size="sm"
          disabled={loading}
        />
      </div>
      <div className="flex gap-1.5 items-center justify-center">
        <Select
          value={method}
          onValueChange={(value) => setMethod(value)}
          disabled={loading}
          aria-label="Select Method"
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            {["rollNo", "batch"].map((method) => (
              <SelectItem key={method} value={method}>
                {changeCase(method, "camel_to_title")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="sm"
          variant="destructive_light"
          disabled={!rollNo || loading}
          onClick={handleDeleteResult}
          aria-label="Delete Result"
        >
          {loading ? "Deleting..." : "Delete Result"}
        </Button>
      </div>
    </div>
  );
}

export function MailResultUpdateDiv() {
  const [targets, setTargets] = useState<string>("");
  // Batches is a comma-separated list of batches to send the mail to
  const [loading, setLoading] = useState<boolean>(false);

  const handleMailResultUpdate = async () => {
    if (!targets) {
      toast.error("Please enter targets");
      return;
    }
    setLoading(true);
    // Validate email addresses
    const emailList = targets.split(",").map((email) => {
      if (z.string().email().safeParse(email.trim()).success) {
        return email.trim();
      }
      return email.trim() + orgConfig.mailSuffix;
    });
    const emailListValid = emailList.filter(
      (email) =>
        emailSchema.safeParse(email.trim()).success ||
        z.string().email().safeParse(email.trim()).success
    );
    console.log("Email List Valid:", emailListValid);
    if (emailListValid.length === 0) {
      toast.error("No valid email addresses found");
      setLoading(false);
      return;
    }
    if (emailListValid.length !== emailList.length) {
      toast.error("Some email addresses are invalid, sending only valid ones");
    }

    try {
      toast
        .promise(sendMailUpdate(emailListValid), {
          loading: "Sending mail...",
          success: "Mail sent successfully",
          error: (error) =>
            `Failed to send mail: ${error.message || "Unknown error"}`,
        })
        .finally(() => setLoading(false));
      setTargets(""); // Clear the input after successful mail
    } catch (error) {
      console.log("Error sending mail:", error);
      toast.error("An unexpected error occurred while sending the mail.");
    }
  };
  return (
    <div className="w-full flex flex-col gap-4 @3xl:p-3">
      <div>
        <Label className="text-xs" htmlFor="emailAddresses">
          Enter Email Addresses
        </Label>
        <Input
          type="text"
          id="emailAddresses"
          name="emailAddresses"
          placeholder="Enter Email Addresses (comma separated)"
          className="w-full max-w-xs"
          value={targets}
          custom-size="sm"
          onChange={(e) => setTargets(e.target.value)}
          disabled={loading}
          aria-label="Email Addresses"
        />
        <p className="text-xs text-muted-foreground">
          {targets
            .split(",")
            .map((email) => {
              if (z.string().email().safeParse(email.trim()).success) {
                return email.trim();
              }
              return email.trim() + orgConfig.mailSuffix;
            })
            .join(", ")}
        </p>
      </div>
      <Button
        size="sm"
        variant="dark"
        disabled={!targets || loading}
        onClick={handleMailResultUpdate}
        aria-label="Send Result Update Mail"
      >
        {loading ? "Sending..." : "Send Result Update Mail"}
      </Button>
    </div>
  );
}

export function AbnormalResultsDiv({
  abnormalsResults,
}: {
  abnormalsResults: AbNormalResult[];
}) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="w-full p-3 lg:p-6 bg-card rounded-lg col-span-3">
      <div className=" flex flex-wrap gap-3 justify-between mb-4">
        <h4 className="text-base font-medium mb-4">Abnormal Results</h4>
        {abnormalsResults.length > 0 && (
          <div className="flex items-center justify-between gap-2">
            <LoaderCircleIcon
              className={`animate-spin ${loading ? "inline-block" : "hidden"}`}
            />
            <Button
              variant="dark"
              disabled={loading}
              onClick={() => {
                // Handle update all logic here
                setLoading(true);
                toast
                  .promise(
                    serverApis.results.bulkUpdateResults(
                      abnormalsResults.map((result) => result.rollNo)
                    ),
                    {
                      loading: "Updating all abnormal results...",
                      success: "All abnormal results updated successfully",
                      error: (error) =>
                        `Failed to update all abnormal results: ${error.message || "Unknown error"}`,
                    }
                  )
                  .finally(() => setLoading(false));
              }}
              size="sm"
            >
              Update All
            </Button>
            <Button
              disabled={loading}
              variant="ghost"
              onClick={() => {
                // Handle delete all logic here
                if (
                  !confirm(
                    "Are you sure you want to delete all abnormal results? This action cannot be undone."
                  )
                ) {
                  return;
                }
                setLoading(true);
                toast
                  .promise(
                    serverApis.results.bulkDeleteResults(
                      abnormalsResults.map((result) => result.rollNo)
                    ),
                    {
                      loading: "Deleting all abnormal results...",
                      success: "All abnormal results deleted successfully",
                      error: (error) =>
                        `Failed to delete all abnormal results: ${error.message || "Unknown error"}`,
                    }
                  )
                  .finally(() => setLoading(false));
              }}
              size="sm"
            >
              Delete All
            </Button>
          </div>
        )}
      </div>
      {abnormalsResults.length === 0 ? (
        <EmptyArea
          title="No Abnormal Results Found"
          description="There are no abnormal results to display. Please check back later."
        />
      ) : (
        <ResponsiveContainer>
          {abnormalsResults.map((result) => (
            <div key={result._id} className="border-b pb-2">
              <h5 className="font-medium text-xs">
                {result.name}
                <Badge size="sm">{result.rollNo}</Badge>
              </h5>
              <p className="text-sm text-muted-foreground">
                <Badge size="sm">sem - {result.semesterCount}</Badge>
                <Badge size="sm">
                  avg - {result.avgSemesterCount.toFixed(1)}
                </Badge>
              </p>
            </div>
          ))}
        </ResponsiveContainer>
      )}
    </div>
  );
}
