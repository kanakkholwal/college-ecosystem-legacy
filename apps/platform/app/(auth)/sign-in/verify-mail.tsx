"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { CardDescription, CardTitle } from "@/components/ui/card";
import ConditionalRender from "@/components/utils/conditional-render";
import { cn } from "@/lib/utils";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "src/lib/auth-client";
import * as z from "zod";
import {ORG_DOMAIN} from "~/project.config";

const FormSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(100, { message: "Email cannot exceed 100 characters" })
    .refine((val) => val.endsWith(`@${ORG_DOMAIN}`), {
      message: `Email must end with @${ORG_DOMAIN}`,
    }),
});

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token =
    (searchParams.get("token") ?? "").trim().length > 0
      ? searchParams.get("token")
      : null;

  useEffect(() => {
    if (token) {
      setIsVerifying(true);
      authClient
        .verifyEmail({
          query: {
            token: token,
          },
        })
        .then((res) => {
          if (res.error) {
            toast.error(res.error);
            setError(
              res?.error?.message ??
                "An error occurred while verifying your email."
            );
          } else {
            setVerified(true);
          }
        })
        .catch((e) => {
          toast.error(e.toString());
          setError(e.toString());
        })
        .finally(() => {
          setIsVerifying(false);
        });
    }
  }, [token]);

  return (
    <main className="flex flex-col items-center justify-center w-full space-y-4">
      <ConditionalRender condition={!!token}>
        <CardTitle>
          {isVerifying ? "Verifying..." : verified ? "Email verified" : "Error"}
        </CardTitle>
        <CardDescription>
          {isVerifying
            ? "Please wait while we verify your email."
            : verified
              ? "Your email has been verified successfully."
              : "An error occurred while verifying your email."}
        </CardDescription>

        <ConditionalRender condition={isVerifying}>
          <LoaderCircle className="w-12 h-12 text-primary animate-spin" />
        </ConditionalRender>
        <ConditionalRender condition={verified}>
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </ConditionalRender>
        <ConditionalRender condition={!!error}>
          <Alert variant="destructive" className={cn("w-full")}>
            <AlertDescription>{error?.toString()}</AlertDescription>
          </Alert>
        </ConditionalRender>
      </ConditionalRender>
      <ConditionalRender condition={!token}>
        <CardTitle>Token not found</CardTitle>
        <CardDescription>
          The token is either invalid or expired. Please try again.
        </CardDescription>
      </ConditionalRender>
    </main>
  );
}
