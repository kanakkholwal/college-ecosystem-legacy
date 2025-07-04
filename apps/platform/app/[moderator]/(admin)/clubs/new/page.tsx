"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createClub } from "~/actions/clubs";
import { clubCategories, clubSchema, ClubSchemaType } from "~/constants/clubs";

export default function CreateClubsPage() {
  const form = useForm<ClubSchemaType>({
    resolver: zodResolver(clubSchema),
    defaultValues: {
      name: "",
      subDomain: "",
      tagline: "",
      description: "",
      logo: "",
      category: clubCategories[0],
      type: "public",
      operationAs: "offline",
      operationSpan: "semester",
      members: [],
      tags: [],
      isVerified: false,
      isClubEmailVerified: false,
      president: {
        name: "",
        email: "",
        phoneNumber: "",
      },
    },
  });

  const onSubmit = (values: ClubSchemaType) => {
    console.log(values);
    toast.promise(createClub(values), {
      loading: "Creating club...",
      success: () => {
        return "Club created successfully!";
      },
      error: (error) => {
        console.error("Error creating club:", error);
        return "Failed to create club. Please try again.";
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h3 className="text-lg font-semibold mb-6">Create New Club</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Accordion type="single" className="w-full bg-card rounded-lg">
            {/* Club Basic Info */}
            <AccordionItem className="border-b-0" value="club-info">
              <AccordionTrigger>Club Information</AccordionTrigger>
              <AccordionContent className="grid grid-cols-2 gap-4 p-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Club Name</FormLabel>
                      <FormControl><Input {...field} placeholder="Enter club name" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagline</FormLabel>
                      <FormControl><Input {...field} placeholder="Enter club tagline" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl><Textarea {...field} rows={4} placeholder="Enter club description" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl><Input type="url" {...field} placeholder="Enter logo URL" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Club Settings */}
            <AccordionItem className="border-b-0" value="settings">
              <AccordionTrigger>Club Settings</AccordionTrigger>
              <AccordionContent className="grid grid-cols-2 gap-4 p-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibility</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a visibility option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="club_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Club Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a club type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="club">Club</SelectItem>
                          <SelectItem value="society">Society</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="operationAs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operation Mode</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an operation mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="offline">Offline</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="operationSpan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operation Span</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an operation span" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="semester">Semester</SelectItem>
                          <SelectItem value="year">Year</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clubCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* President Info */}
            <AccordionItem className="border-b-0" value="president">
              <AccordionTrigger>President Information</AccordionTrigger>
              <AccordionContent className="grid grid-cols-2 gap-4 p-4">
                <FormField
                  control={form.control}
                  name="president.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input {...field} placeholder="Enter president name" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="president.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" {...field} placeholder="Enter president email" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="president.phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input type="tel" {...field} placeholder="Enter president phone number" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
            {/* Domain Info */}
            <AccordionItem className="border-b-0" value="domain">
              <AccordionTrigger>Domain Information</AccordionTrigger>
              <AccordionContent className="grid grid-cols-2 gap-4 p-4">
                <FormField
                  control={form.control}
                  name="subDomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subdomain</FormLabel>
                      <FormControl><Input {...field} placeholder="Enter subdomain" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customDomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Domain</FormLabel>
                      <FormControl><Input {...field} placeholder="Enter custom domain" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>


          </Accordion>

          <div className="flex items-center px-4">
            <Button type="submit">
              <Save /> Create Club
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
