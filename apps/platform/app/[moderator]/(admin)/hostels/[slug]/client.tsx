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
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { isValidRollNumber } from "~/constants/departments";
import { updateHostelSchema } from "~/constants/hostel_n_outpass";

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
  students: z.string().email(),
  rollNo: z.boolean(),
});
// ends with @nith.ac.in
const emailSchema = z
  .string()
  .email()
  .refine((email) => email.endsWith("@nith.ac.in"), {
    message: "Email should end with @nith.ac.in",
  });

export function UpdateStudentsForm() {
  const form = useForm<z.infer<typeof updateHostelStudentSchema>>({
    resolver: zodResolver(updateHostelStudentSchema),
    defaultValues: {
      students: [],
    },
  });

  const handleSubmit = async (
    data: z.infer<typeof updateHostelStudentSchema>
  ) => {
    try {
      console.log(data);

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
            name="students"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Students Email</FormLabel>
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
                        .split(/,|\n/)
                        .map((email) => {
                          // if(isValidRollNumber(email))
                          //     return email.concat("@nith.ac.in")
                          return email.trim();
                        })
                        .filter(
                          (email) => emailSchema.safeParse(email).success
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
          <div className="flex items-center justify-start gap-3 w-full">
            {form.watch("students").map((student, index) => {
              const studentError = emailSchema.safeParse(student).error;

              return (
                <div
                  key={student}
                  className="inline-flex justify-start items-start gap-2"
                >
                  <div className="inline-flex justify-start items-center space-x-2">
                    <div>{student}</div>
                    <Button
                      type="button"
                      size="icon_sm"
                      variant="destructive_light"
                      onClick={() => {
                        form.setValue(
                          "students",
                          form.watch("students").filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <X />
                    </Button>
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
