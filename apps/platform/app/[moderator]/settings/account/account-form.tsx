"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, VercelTabsList } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BiLockOpenAlt } from "react-icons/bi";
import * as z from "zod";
import { changeUserPassword, updateUser } from "~/actions/dashboard.admin";
import { emailSchema } from "~/constants";
import type { Session } from "~/lib/auth-client";

interface Props {
  currentUser: Session["user"];
}

const formSchema = z.object({
  gender: z.enum(["male", "female", "not_specified"]),
  other_emails: z.array(emailSchema),

});
const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must be at most 128 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    })
})

export function AccountForm({ currentUser }: Props) {


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      other_emails: currentUser.other_emails || [],
      gender: currentUser.gender as "male" | "female" | "not_specified",
    },
  });
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    toast.promise(
      updateUser(currentUser.id, {
        ...data,
      }),
      {
        loading: "Updating user...",
        success: "User updated successfully",
        error: "Failed to update user",
      }
    );
  };
  const changePassword = async (data: z.infer<typeof passwordSchema>) => {

    toast
      .promise(
        changeUserPassword(currentUser.id, data.password),
        {
          loading: "Updating password..",
          success: "Password updated successfully",
          error: "Something went wrong",
        }
      )
      .finally(() => {
        passwordForm.reset();
      });
  };
  const isOnlyStudent =
    currentUser.other_roles.length === 1 &&
    currentUser.other_roles.includes("student");

  return (
    <>
      <Tabs defaultValue="account-details" className="mb-4">
        <TabsContent value="account-details">
          <div>
            <h3 className="text-lg font-medium">Account</h3>
            <p className="text-sm text-muted-foreground">
              Update your account settings.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="password">
          <div>
            <h3 className="text-lg font-medium">Password</h3>
            <p className="text-sm text-muted-foreground">
              Change your password.
            </p>
          </div>
        </TabsContent>
        <Separator className="my-4" />
        <VercelTabsList
          className="w-full"
          tabs={[
            { id: "account-details", label: "Account Details" },
            { id: "password", label: "Password" },
          ]}
          onTabChangeQuery="tab"
        />
        <TabsContent value="account-details">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <ToggleGroup
                        defaultValue={"not_specified"}
                        value={field.value}
                        onValueChange={(value) =>
                          currentUser.gender !== "not_specified" &&
                          field.onChange(value)
                        }
                        className="justify-start"
                        type="single"
                        disabled={currentUser.gender === "not_specified"}
                      >
                        {["male", "female", "not_specified"].map((item) => (
                          <ToggleGroupItem
                            value={item}
                            key={item}
                            size="sm"
                            className="capitalize"
                            disabled={currentUser.gender !== "not_specified"}
                          >
                            {item.replace("_", " ")}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </FormControl>

                    <FormDescription>
                      {currentUser.gender === "not_specified"
                        ? "You can set your gender here."
                        : "You cannot change your gender."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {currentUser.role === "admin" ||
                (!isOnlyStudent && (
                  <FormField
                    control={form.control}
                    name="other_emails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Emails</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter other emails separated by commas"
                            value={field.value.join(", ")}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  .split(",")
                                  .map((email) => email.trim())
                              )
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          You can add multiple emails separated by commas.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

              <Button type="submit" variant="default_light" size="sm" disabled={form.formState.isSubmitting}>
                <Save /> Update Account
              </Button>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="password" className="mt-4">
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(changePassword)} className="space-y-4 mt-2">

              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor={field.name}>
                      New Password
                    </Label>
                    <div className="relative group">
                      <FormLabel className="absolute top-1/2 -translate-y-1/2 left-4 z-50">
                        <BiLockOpenAlt className="w-4 h-4 group-focus-within:text-primary" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="*********"
                          type="password"
                          autoCapitalize="none"
                          autoComplete="password"
                          autoCorrect="off"
                          className="pl-10 pr-5 !mt-0"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />



              <Button
                variant="default_light"
                type="submit"
                size="sm"

                disabled={passwordForm.formState.isSubmitting}
              >
                <Save />
                Update Password
              </Button>

            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </>
  );
}
