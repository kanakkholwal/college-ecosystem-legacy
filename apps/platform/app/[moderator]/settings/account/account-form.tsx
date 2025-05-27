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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { updateUser } from "~/actions/dashboard.admin";
import { emailSchema } from "~/constants";
import type { Session } from "~/lib/auth-client";

interface Props {
  currentUser: Session["user"];
}

const formSchema = z.object({
  gender: z.enum(["male", "female", "not_specified"]),
  other_emails: z.array(emailSchema),
});

export function AccountForm({ currentUser }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      other_emails: currentUser.other_emails || [],
      gender: currentUser.gender as "male" | "female" | "not_specified",
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

  return (
    <>
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

                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
