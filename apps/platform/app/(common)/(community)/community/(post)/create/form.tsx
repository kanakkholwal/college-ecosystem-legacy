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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Content, JSONContent } from "@tiptap/react";
import { Loader2, SendHorizontal } from "lucide-react";
import { defaultExtensions, NexoEditor, renderToMarkdown } from 'nexo-editor';
import "nexo-editor/index.css";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { z } from "zod";
import { createPost } from "~/actions/common.community";
import { CATEGORY_TYPES, SUB_CATEGORY_TYPES } from "~/constants/common.community";
import { rawCommunityPostSchema } from "~/models/community";

export default function CreateCommunityPost() {
  const searchParams = useSearchParams();
  const form = useForm<z.infer<typeof rawCommunityPostSchema>>({
    resolver: zodResolver(rawCommunityPostSchema),
    defaultValues: {
      title: searchParams.get("title") || "",
      content: "",
      content_json: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Hello, this is a simple editor built with Nexo Editor!"
              }
            ]
          }
        ]
      } as Content,
      category: CATEGORY_TYPES[0],
      subCategory: SUB_CATEGORY_TYPES[0],
    },
  });

  function onSubmit(values: z.infer<typeof rawCommunityPostSchema>) {
    console.log(values);
    toast.promise(createPost(values), {
      loading: "Creating Post",
      success: () => {
        form.reset({
          title: "",
          content: "",
          content_json: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Hello, this is a simple editor built with Nexo Editor!",
                  },
                ],
              },
            ],
          } as Content,
          category: CATEGORY_TYPES[0],
          subCategory: SUB_CATEGORY_TYPES[0],
        });
        return "Post Created";
      },
      error: "Failed to create Post",
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-2 lg:p-4 bg-card rounded-lg"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a catchy title"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormDescription>A short title for the post.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content_json"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <NexoEditor
                  content={field.value as Content}
                  onChange={(content) => {
                    field.onChange(content)
                    form.setValue("content", renderToMarkdown({
                      content: form.getValues("content_json") as JSONContent,
                      extensions: defaultExtensions,
                    }));
                  }}
                />
              </FormControl>
              <FormDescription>The content of the post.</FormDescription>
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
              <Select
                onValueChange={field.onChange}
                value={field.value || searchParams.get("category") || ""}
                disabled={form.formState.isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORY_TYPES.map((type) => {
                    return (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormDescription>The category of the post.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("category").toLowerCase() === "departmental" && (
          <FormField
            control={form.control}
            name="subCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || searchParams.get("subCategory") || ""}
                  defaultValue={
                    field?.value || searchParams.get("subCategory") || ""
                  }
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Sub category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SUB_CATEGORY_TYPES.map((type) => {
                      return (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormDescription>The Sub category of the post.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button
          type="submit"
          variant="dark"
          width="content"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : null}
          {form.formState.isSubmitting ? "Publishing..." : "Publish Post"}
          {form.formState.isSubmitting ? null : <SendHorizontal />}
        </Button>
      </form>
    </Form>
  );
}
