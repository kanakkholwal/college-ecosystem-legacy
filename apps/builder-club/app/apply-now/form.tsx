'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ApplicationFormData, applicationSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";
import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

export function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      collegeId: "",
      collegeYear: "1st",
      mobile: "",
      workLinks: [{
        url: ""
      }],
      bestProject: "",
      bestHack: ""
    }
  });

  const { control, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray<ApplicationFormData>({
    control,
    name: "workLinks",
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submit-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast.success("Application Submitted!", {
          description: "We've received your application successfully.",
          duration: 3000,
        });
      } else {
        toast.error("Error", {
          description: "There was an issue submitting your application. Please try again.",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "There was an issue submitting your application. Please try again.",
      });
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* Name */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* College Email */}
        <FormField
          control={control}
          name="collegeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>College Email</FormLabel>
              <FormControl>
                <Input placeholder="your.id@nith.ac.in" {...field} />
              </FormControl>
              <FormDescription>Must be your official NITH email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mobile Number */}
        <FormField
          control={control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" {...field} />
              </FormControl>
              <FormDescription>Must be a 10-digit mobile number</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* College Year */}
        <FormField
          control={control}
          name="collegeYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Year</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your current year" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["1st", "2nd", "3rd", "4th"].map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Work Links */}
        <FormField
          control={control}
          name="workLinks"
          render={({  }) => (
            <FormItem>
              <FormLabel>Work Links</FormLabel>
              <div className="space-y-4 mt-2">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={control}
                    name={`workLinks.${index}.url`}
                    render={({ field }) => (
                      <FormItem className="items-center grid gap-2 grid-cols-[1fr_auto]">
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <Button type="button" variant="outline" size="icon" onClick={() => remove(index)} disabled={fields.length === 1}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ url: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Another Link
                </Button>
              </div>
              <FormDescription className="mt-2">
                Portfolio, GitHub, LinkedIn, Resume, or project links.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Best Project */}
        <FormField
          control={control}
          name="bestProject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Best Project (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe a project you're proud of..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Best Hack */}
        <FormField
          control={control}
          name="bestHack"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Best Hack (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe a clever solution you've built..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A creative workaround or unconventional solution
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>

      </form>
    </Form>
  );
}
