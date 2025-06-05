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
import { Loader2, SendHorizontal, Trash2 } from "lucide-react";
import NexoMdxEditor from "nexo-mdx";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CATEGORY_TYPES, SUB_CATEGORY_TYPES } from "src/constants/community";
import type { z } from "zod";
import { updatePost } from "~/lib/community/actions";
import {
  CommunityPostTypeWithId,
  rawCommunityPostSchema,
} from "~/models/community";

export default function EditCommunityPost({
  postId,
  post,
}: {
  postId: string;
  post: CommunityPostTypeWithId;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const form = useForm<z.infer<typeof rawCommunityPostSchema>>({
    resolver: zodResolver(rawCommunityPostSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
      category: post.category,
      subCategory: post.subCategory,
    },
  });

  function onSubmit(values: z.infer<typeof rawCommunityPostSchema>) {
    console.log(values);
    toast.promise(updatePost(postId, values), {
      loading: "Updating Post",
      success: (data) => {
        console.log(data);
        router.refresh();
        return "Post Updated";
      },
      error: "Failed to update Post",
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
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <NexoMdxEditor
                  placeholder="Write your post content here..."
                  className="!h-auto p-0"
                  rows={12}
                  disabled={form.formState.isSubmitting}
                  // renderHtml={(md) => (
                  //   <div className="prose w-full prose-sm dark:prose-invert">
                  //     <MDXRemote source={md} parseFrontmatter />
                  //   </div>
                  // )}
                  {...field}
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
                      <SelectItem key={type} value={type}>
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
        <div className="inline-flex items-center gap-2 justify-between w-full">
          <Button
            type="submit"
            variant="default_light"
            width="xs"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : null}
            {form.formState.isSubmitting ? "Updating..." : "Update Post"}
            {form.formState.isSubmitting ? null : <SendHorizontal />}
          </Button>
          <Button
            type="button"
            variant="destructive_light"
            size="icon_sm"
            disabled={form.formState.isSubmitting}
            onClick={() => {
              toast.error("This feature is not implemented yet.");
            }}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Trash2 />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
