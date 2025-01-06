"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ConditionalRender from "@/components/utils/conditional-render";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LuMail } from "react-icons/lu";
import { authClient } from "src/lib/auth-client";
import * as z from "zod";

const FormSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(100, { message: "Email cannot exceed 100 characters" })
    .refine((val) => val.endsWith("@nith.ac.in"), {
      message: "Email must end with @nith.ac.in",
    }),
});

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);

    setIsSubmitting(true);

    try {
      const res = await authClient.forgetPassword({
        email: data.email,
        redirectTo: "/sign-in?tab=reset-password",
      });
      if (res.error) {
        toast.error(
          res.error?.message || "An error occurred. Please try again."
        );
        return;
      }
      toast.success("Password reset link sent to your email");

      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        toast.error(err?.message || "An error occurred. Please try again.");
      }
      console.error(err);

      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center w-full space-y-4">
      <ConditionalRender condition={isSubmitted}>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          We&apos;ve sent a password reset link to your email.
        </CardDescription>
        <Alert variant="success" className="w-full">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            If you don&lsquo;t see the email, check your spam folder.
          </AlertDescription>
        </Alert>
      </ConditionalRender>
      <ConditionalRender condition={!isSubmitted}>
        <CardTitle>Forgot your password?</CardTitle>
        <CardDescription>
          Enter your email to reset your password
        </CardDescription>
        <div className={cn("grid gap-6 w-full text-left py-4")}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative group">
                      <FormLabel className="absolute top-1/2 -translate-y-1/2 left-4 z-50">
                        <LuMail className="w-4 h-4" />
                      </FormLabel>
                      <FormControl className="relative">
                        <Input
                          placeholder="yourname@nith.ac.in"
                          type="email"
                          autoCapitalize="none"
                          autoComplete="email"
                          disabled={isSubmitting}
                          autoCorrect="off"
                          className="pl-10 pr-5"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="mt-2 tracking-wide"
                variant="default"
                rounded="full" type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          </Form>
        </div>
      </ConditionalRender>
    </main>
  );
}
