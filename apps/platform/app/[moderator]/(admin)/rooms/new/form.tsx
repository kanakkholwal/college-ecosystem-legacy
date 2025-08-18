"use client";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
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
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { z } from "zod";
import { roomSchema, roomTypes } from "~/constants/common.room";
import { RoomSelect } from "~/db/schema/room";

type RoomType = z.infer<typeof roomSchema>;

export default function CreateRoomForm({
  onSubmit,
}: {
  onSubmit: (room: RoomType) => Promise<RoomSelect>;
}) {
  const form = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomNumber: "",
      roomType: roomTypes[0],
      capacity: 0,
      currentStatus: "occupied",
      lastUpdatedTime: new Date(),
    },
  });
  const handleSubmit = async (data: RoomType) => {
    toast.promise(onSubmit(data), {
      loading: "Saving...",
      success: (data: { roomNumber: string | number }) =>
        `Room ${data.roomNumber} created successfully`,
      error: "Could not create room",
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 my-5 p-4 bg-card grid gap-4 w-full grid-cols-1 md:grid-cols-2"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="roomNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Room Number"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="name"
                    autoCorrect="off"
                    {...field}
                    value={field.value as string | number | undefined}
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
            name="roomType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Type</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value.trim())}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a room type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roomTypes.map((_type) => {
                      return (
                        <SelectItem key={_type} value={_type}>
                          {_type}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Capacity"
                    type="number"
                    autoCapitalize="none"
                    autoCorrect="off"
                    {...field}
                    value={field.value as string | number | undefined}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <CardFooter>
          <Button type="submit" className="mx-auto">
            Create Room <Plus className="inline-block ml-2" size={16} />
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
