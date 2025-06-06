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
import { Label } from "@/components/ui/label";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import toast from "react-hot-toast";
import serverApis from "~/lib/server-apis/client";
import type {
  ResultType,
  rawResultSchemaType,
  rollNoSchemaType,
} from "~/lib/server-apis/types";
import { orgConfig } from "~/project.config";
import { changeCase } from "~/utils/string";

const availableMethods = [
  "getResultByRollNoFromSite",
  "getResultByRollNo",
  "addResultByRollNo",
  "updateResultByRollNo",
] as (keyof typeof serverApis.results)[];

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
    if (!availableMethods.includes(method as keyof typeof serverApis.results)) {
      toast.error("Invalid method selected");
      return;
    }
    setLoading(true);
    try {
      if (method === "getResultByRollNoFromSite") {
        const { data: response } =
          await serverApis.results.getResultByRollNoFromSite(rollNo);
        if (response?.error || !response?.data) {
          toast.error(response?.message || "Failed to fetch result from site");
          return;
        }
        setResult(response?.data);
      } else if (method === "getResultByRollNo") {
        const { data: response } =
          await serverApis.results.getResultByRollNo(rollNo);
        if (response?.error || !response?.data) {
          toast.error(response?.message || "Failed to fetch result by Roll No");
          return;
        }
        setResult(response.data);
      } else if (method === "addResultByRollNo") {
        const { data: response } =
          await serverApis.results.addResultByRollNo(rollNo);
        if (response?.error || !response?.data) {
          toast.error(response?.message || "Failed to add result by Roll No");
          return;
        }
        setResult(response.data);
      } else if (method === "updateResultByRollNo") {
        const { data: response } =
          await serverApis.results.updateResultByRollNo([
            rollNo as rollNoSchemaType,
            {},
          ]);
        if (response?.error || !response?.data) {
          toast.error(
            response?.message || "Failed to update result by Roll No"
          );
          return;
        }
        setResult(response.data);
      }
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
    <div className="w-full flex flex-col gap-4 @3xl:p-3">
      <div>
        <Label className="text-xs">Enter Roll No to Get Result</Label>
        <Input
          type="text"
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
          <SelectTrigger custom-size="sm">
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

  const handleDeleteResult = async () => {
    if (!rollNoSchema.safeParse(rollNo).success) {
      toast.error("Invalid Roll No");
      return;
    }
    setLoading(true);
    try {
      const { data: response } =
        await serverApis.results.deleteResultByRollNo(rollNo);
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
        <Label className="text-xs">Enter Roll No to Delete Result</Label>
        <Input
          type="text"
          placeholder="Enter Roll No"
          className="w-full max-w-xs"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          custom-size="sm"
          disabled={loading}
          aria-label="Roll No"
        />
      </div>
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
  );
}

export function MailResultUpdateDiv(){
  const [targets, setTargets] = useState<string>("");
  // Batches is a comma-separated list of batches to send the mail to
  const [loading, setLoading] = useState<boolean>(false);

  const handleMailResultUpdate = async () => {
    if (!targets) {
      toast.error("Please enter targets");
      return;
    }
    setLoading(true);
    try {
      const { data: response } =
        await serverApis.mail.sendResultUpdate({
          subject: " Semester Result Notification",
          template_key: "result_update",
          targets: targets.split(",").map((email) => email.trim() + orgConfig.mailSuffix),
          payload: {
            batch: "Academic Year " + new Date().getFullYear(),
          },
        });
      if (response?.error || !response?.data) {
        toast.error(response?.message || "Failed to send mail");
        return;
      }
      toast.success("Mail sent successfully");
      setTargets(""); // Clear the input after successful mail
    } catch (error) {
      console.log("Error sending mail:", error);
      toast.error("An unexpected error occurred while sending the mail.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full flex flex-col gap-4 @3xl:p-3">
      <div>
        <Label className="text-xs">
          Enter Email Addresses to Send Result Update Mail (comma separated)
        </Label>
        <Input
          type="text"
          placeholder="Enter Email Addresses (comma separated)"
          className="w-full max-w-xs"
          value={targets}
          custom-size="sm"
          onChange={(e) => setTargets(e.target.value)}
          disabled={loading}
          aria-label="Email Addresses"
        />
        <p className="text-xs text-muted-foreground">
          {targets.split(",").map((email) => email.trim() + orgConfig.mailSuffix).join(", ")}
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
