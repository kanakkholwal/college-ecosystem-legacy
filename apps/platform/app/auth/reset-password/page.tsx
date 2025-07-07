"use client";

import { Button } from "@/components/ui/button";
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { authClient } from "~/lib/auth-client";

const FormSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmNewPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords must match",
    path: ["confirmNewPassword"],
  });

export default function ResetPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token =
    (searchParams.get("token") ?? "").trim().length > 0
      ? searchParams.get("token")
      : null;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }
    if(!data.newPassword || !data.confirmNewPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error("Passwords do not match");
      form.setError("confirmNewPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      form.setError("newPassword", {
        type: "validate",
        message: "Passwords do not match",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Replace this with the actual reset password API call
      const res = await authClient.resetPassword({
        newPassword: data.newPassword,
        token: token,
      });
      if (res.error) {
        toast.error(
          res.error?.message || "An error occurred. Please try again."
        );
        return;
      }
      toast.success("Password reset successful,Can Login now ");
      router.push("/auth/sign-in");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="px-4 py-6">
      <CardHeader className="text-center">
        <CardTitle>Reset Your Password</CardTitle>
        <CardDescription>
          Enter and confirm your new password below
        </CardDescription>
      </CardHeader>
      <CardContent className={cn("grid gap-6 w-full text-left pb-4")}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your new password"
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="mt-2"
              variant="default"
              rounded="full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
