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
import { Minus } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface LinkInputProps {
  index: number;
  value: string;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

const LinkInput: React.FC<LinkInputProps> = ({ index, value, onChange, onRemove }) => (
  <div className="flex gap-2 items-center">
    <Input
      type="url"
      placeholder="https://example.com"
      value={value}
      onChange={(e) => onChange(index, e.target.value)}
    />
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={() => onRemove(index)}
    >
      <span className="text-lg">
        <Minus className="h-4 w-4" />
      </span>
    </Button>
  </div>
);

export function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      collegeId: "",
      collegeYear: "1st",
      workLinks: [""],
      bestProject: "",
      bestHack: ""
    }
  });

  const { control, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submit-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        // toast({
        //   title: "Application Submitted!",
        //   description: "We've received your application successfully.",
        // });
        toast.success("Application Submitted! ", {
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
        })
        console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const workLinks = form.watch("workLinks");

  const addLink = () => {
    form.setValue("workLinks", [...workLinks, ""]);
  };

  const removeLink = (index: number) => {
    if (workLinks.length > 1) {
      const newLinks = [...workLinks];
      newLinks.splice(index, 1);
      form.setValue("workLinks", newLinks);
    }
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...workLinks];
    newLinks[index] = value;
    form.setValue("workLinks", newLinks);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                  {["1st", "2nd", "3rd", "4th", "M.Tech", "Ph.D"].map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Work Links</FormLabel>
          <div className="space-y-4">
            {workLinks.map((link, index) => (
              <LinkInput
                key={index}
                index={index}
                value={link}
                onChange={updateLink}
                onRemove={removeLink}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addLink}
            >
              Add Another Link
            </Button>
          </div>
          <FormDescription className="mt-2">
            Portfolio, GitHub, LinkedIn, Resume, or project ideas
          </FormDescription>
          {errors.workLinks && (
            <p className="text-sm font-medium text-destructive">
              {errors.workLinks.message}
            </p>
          )}
        </div>

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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </Form>
  );
}