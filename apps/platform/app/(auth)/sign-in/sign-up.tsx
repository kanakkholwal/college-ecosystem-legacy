"use client";

import { authClient } from "src/lib/auth-client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { BiLockOpenAlt } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { LuMail } from "react-icons/lu";

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
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineLoading } from "react-icons/ai";

import * as z from "zod";
import { getDepartmentName } from "src/constants/departments";

const FormSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(100, { message: "Email cannot exceed 100 characters" })
    .refine((val) => val.endsWith("@nith.ac.in"), {
      message: "Email must end with @nith.ac.in",
    }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50, { message: "Password cannot exceed 50 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
});

export default function Unauthorized() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "/";

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);

    setIsLoading(true);
    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: redirect,
        name: "Kanak Kholwal",
        username: "21dec026",
        gender: "male",
        role:"user",
        other_roles: ["student"],
        department: getDepartmentName("ece"),
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onResponse: () => {
          setIsLoading(false);
        },
        onError: (ctx: { error: { message: string } }) => {
          console.log(ctx);
          toast.error(ctx.error.message);
        },
      }
    );
  }

  return (
    <>
    
            <main className="flex flex-col items-center justify-center w-full p-4 space-y-4">
              <div className={cn("grid gap-6 w-full text-left px-4")}>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid gap-2"
                  >
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
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                disabled={isLoading}
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
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="relative group">
                            <FormLabel className="absolute top-1/2 -translate-y-1/2 left-4 z-50">
                              <BiLockOpenAlt className="w-4 h-4" />
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="*********"
                                type="password"
                                autoCapitalize="none"
                                autoComplete="password"
                                autoCorrect="off"
                                disabled={isLoading}
                                className="pl-10 pr-5 !mt-0"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <p className="text-right mt-2 text-sm font-medium">
                      <Link
                        href="/forgot-password"
                        className="text-primary hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </p>

                    <Button
                      disabled={isLoading}
                      type="submit"
                      className="mt-2 tracking-wide"
                      variant="default"
                    >
                      {isLoading && (
                        <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Sign In with Email
                    </Button>
                  </form>
                </Form>
                <div className="relative z-0">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-t-primary/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase z-10">
                    <span className="px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <div className="grid  grid-cols-1">
                  <Button
                    variant="light"
                    type="button"
                    disabled={isLoading}
                    width={"full"}
                    onClick={async () => {
                      setIsLoading(true);
                      // await authClient.signIn.social({
                      //   provider: "google",
                      //   callbackURL: redirect,
                      // });
                      setIsLoading(false);
                    }}
                  >
                    {isLoading ? (
                      <AiOutlineLoading className="h-6 w-6 animate-spin" />
                    ) : (
                      <FcGoogle className=" h-6 w-6" />
                    )}
                    {isLoading ? "Signing in..." : "Sign in with Google"}
                  </Button>
                </div>
              </div>
            </main>
         
    </>
  );
}
