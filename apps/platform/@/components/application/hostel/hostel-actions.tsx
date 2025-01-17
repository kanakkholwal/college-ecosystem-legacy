"use client";
import { Badge } from "@/components/ui/badge";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { updateHostel } from "~/actions/hostel";
import { isValidRollNumber } from "~/constants/departments";
import { updateHostelSchema } from "~/constants/hostel_n_outpass";
import { ORG_DOMAIN } from "~/project.config";

export function UpdateHostelForm() {
  const form = useForm<z.infer<typeof updateHostelSchema>>({
    resolver: zodResolver(updateHostelSchema),
    defaultValues: {
      administrators: [],
      warden: {
        name: "",
        email: "",
        userId: null,
      },
      students: [],
    },
  });
  const handleSubmit = async (data: z.infer<typeof updateHostelSchema>) => {
    try {
      console.log(data);
      // toast.promise(updateHostel(data), {
      //     loading: "Creating Hostel",
      //     success: "Hostel created successfully",
      //     error: "Failed to create hostel"
      // })

      toast.success("Hostel created successfully");
    } catch (error) {
      toast.error("Failed to create user");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 my-5 p-2"
      >
        <div className="grid grid-cols-1 gap-3">
          <FormField
            control={form.control}
            name="warden.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warden Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Warden Name"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="name"
                    autoCorrect="off"
                    {...field}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="warden.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warden Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Warden Email"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    {...field}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          Update Hostel
        </Button>
      </form>
    </Form>
  );
}

const updateHostelStudentSchema = z.object({
  students: z.array(z.string().email()),
  rollNo: z.boolean().optional(),
  search: z.string().optional(),
});


const emailSchema = z
  .string()
  .email()
  .refine((val) => val.endsWith(`@${ORG_DOMAIN}`), {
    message: `Email must end with @${ORG_DOMAIN}`,
  })

export function UpdateStudentsForm({ slug }: { slug: string }) {
  const form = useForm<z.infer<typeof updateHostelStudentSchema>>({
    resolver: zodResolver(updateHostelStudentSchema),
    defaultValues: {
      students: [],
      search: "",
    },
  });

  const handleSubmit = async (
    data: z.infer<typeof updateHostelStudentSchema>
  ) => {
    try {
      console.log("data", data);
      toast.promise(
        updateHostel(slug, {
          students: data.students,
        }),
        {
          loading: "Updating Students",
          success: (msg: string | undefined) => {
            console.log(msg);
            return msg ||"Students updated successfully";
          },
          error: (msg: string | undefined) => {
            console.log(msg);

            return msg ||"Failed to update students";
          },
        }
      );

    } catch (error) {
      toast.error("Failed to create user");
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 my-5 p-2"
      >
        <div className="grid grid-cols-1 gap-3">
          <FormField
            control={form.control}
            name="students"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Students Email ({form.watch("students").length} students
                  added)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Students Email"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    onChange={(e) => {
                      // split by comma and line break  and remove spaces
                      const emails = e.target.value
                        .split(/,|\n/) // Split by commas or newlines
                        .map((entry) => {
                          // Extract email if present in the entry
                          const emailMatch = entry.match(/<([^>]+)>/); // Match the email within angle brackets
                          if (emailMatch) {
                            return emailMatch[1].toLowerCase().trim();
                          }
                          // Handle roll number pattern
                          return isValidRollNumber(entry)
                            ? entry.concat(`@${ORG_DOMAIN}`).toLowerCase().trim()
                            : entry.toLowerCase().trim();
                        })
                        .filter(
                          (email) => emailSchema.safeParse(email).success
                        ); // Validate emails
                      console.log(
                        emails,
                        e.target.value
                          .split(/,|\n/) // Split by commas or newlines
                          .map((entry) => {
                            // Extract email if present in the entry
                            const emailMatch = entry.match(/<([^>]+)>/); // Match the email within angle brackets
                            if (emailMatch) {
                              return emailMatch[1].toLowerCase().trim();
                            }
                            // Handle roll number pattern
                            return isValidRollNumber(entry)
                            ? entry.concat(`@${ORG_DOMAIN}`).toLowerCase().trim()
                              : entry.toLowerCase().trim();
                          })
                      );
                      form.setValue("students", emails);
                    }}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-start gap-3 w-full flex-wrap">
            {form.watch("students").map((entry, index) => {
              const studentError = emailSchema.safeParse(entry).error;

              return (
                <div
                  key={entry}
                  className="inline-flex justify-start items-start gap-2"
                >
                  <div className="inline-flex justify-start items-center space-x-2 bg-gray-200 p-1 rounded-lg">
                    <div className="text-sm">{entry}</div>
                    <Badge
                      size="sm"
                      className="h-5 w-5 cursor-pointer"
                      variant="destructive_light"
                      onClick={() => {
                        form.setValue(
                          "students",
                          form.watch("students").filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Badge>
                  </div>
                  {studentError && (
                    <p className="text-red-500 text-xs">
                      {studentError.message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          Update Hostel
        </Button>
      </form>
    </Form>
  );
}
