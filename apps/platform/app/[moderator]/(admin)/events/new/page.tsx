"use client";
import { EventCard } from "@/components/application/event-card";
import { ResponsiveContainer } from "@/components/common/container";
import { DateTimePicker } from "@/components/extended/date-n-time";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, VercelTabsList } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createNewEvent, saveNewEvents } from "~/actions/events";
import { generateEventsByDoc } from "~/ai/actions";
import { eventTypes, rawEventsSchema, rawEventsSchemaType } from "~/constants/events";

export default function CreateNewEvent() {
  const searchParams = useSearchParams();
  const [fileReference, setFileReference] = useState<string | ArrayBuffer | null>(null);
  const [generatedEvents, setGeneratedEvents] = useState<
    rawEventsSchemaType[] | null
  >(null);
  const [acceptedIndices, setAcceptedIndices] = useState<
    number[]
  >([]);
  const [generatingEvents, setGeneratingEvents] = useState<boolean>(false);
  const [savingEvents, setSavingEvents] = useState<boolean>(false);

  const form = useForm<rawEventsSchemaType>({
    resolver: zodResolver(rawEventsSchema),
    defaultValues: {
      title: "",
      description: "",
      links: [],
      time: searchParams.get("time")
        ? new Date(searchParams.get("time") || "")
        : new Date(),
      endDate: searchParams.get("endDate")
        ? new Date(searchParams.get("endDate") || "")
        : undefined,
      eventType: eventTypes[0],
      location: "",
    },
  });

  const handleSubmit = async (data: rawEventsSchemaType) => {
    console.log("Form Data:", data);
    toast.promise(createNewEvent(data), {
      loading: "Creating new event",
      success: "New Event created successfully",
      error: "Failed to create new event",
    });
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    console.log("Input changed:", selectedFile);
    // convert file to base64  and log it
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileReference(reader.result);
        console.log("Reference Image loaded")
      };
      reader.readAsDataURL(selectedFile);
    }
  }
  const generateEvents = async () => {
    if (fileReference) {
      console.log("File to upload:", !!fileReference);
      try {
        setGeneratingEvents(true);
        const response = await generateEventsByDoc([fileReference as string]);
        if (response.error) {
          console.error("Error generating events:", response.error);
        }
        console.log("Generated Events:", response.events);
        setGeneratedEvents(
          response.events.map((event) => ({
            ...event,
            time: new Date(event.time),
            endDate: undefined,
            description: event.description ?? "",
            links: [],
          }))
        );
        setAcceptedIndices([]);
        toast.success(response.message);
        // toast.promise(
        //   generateEventsByDoc([fileReference as string]),
        //   {
        //     loading: "Generating events from reference",
        //     success: (response) => {
        //       if (response.error !== null) {
        //         console.error("Error generating events:", response.error);
        //         throw Error(response.message)
        //       }
        //       console.log("Generated Events:", response.events);
        //       setGeneratedEvents(
        //         response.events.map((event) => ({
        //           ...event,
        //           time: new Date(event.time),
        //           endDate: event.endDate ? new Date(event.endDate) : undefined,
        //           description: event.description ?? "",
        //           links: [],
        //         }))
        //       )
        //       return response.message
        //     },
        //     error: "Error occurred while generating events"
        //   }
        // ).finally(() => setGeneratingEvents(false));
      } catch (error) {
        console.error(error)
        toast.error(error instanceof Error ? error.message : "Error occurred while generating events")
      } finally {
        setGeneratingEvents(false);
      }
    }
  }

  const saveAcceptedEvents = async () => {
    if (acceptedIndices.length === 0) {
      toast.error("No events accepted to save");
      return;
    }
    const acceptedEvents = generatedEvents?.filter((_, i) =>
      acceptedIndices.includes(i)
    );
    if (!acceptedEvents || acceptedEvents.length === 0) {
      toast.error("No events to save");
      return;
    }
    try {
      setSavingEvents(true);
      toast.promise(saveNewEvents(acceptedEvents), {
        loading: "Adding accepted events to calendar",
        success: "Accepted events added to calendar successfully",
        error: "Error occurred while adding events to calendar",
      }).finally(() => setSavingEvents(false));
      // setAcceptedIndices([]);
      // setGeneratedEvents(null);
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while adding events to calendar");
    } finally {
      setSavingEvents(false);
    }
  }
  return (
    <Tabs className="w-full" defaultValue="create-event">
      <VercelTabsList
        tabs={[
          {
            label: "Create Event",
            id: "create-event",
          },
          {
            label: "Import Events",
            id: "import-events",
          },
        ]}
        defaultValue="create-event"
      />
      <TabsContent value="create-event">

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="my-5 p-4 bg-card rounded-lg"
          >
            <h2 className="text-lg font-semibold">Create New Event</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Event Title"
                        type="text"
                        autoCapitalize="none"
                        autoComplete="off"
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
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Event Description"
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect="off"
                        {...field}
                        disabled={form.formState.isSubmitting}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a event Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {eventTypes.map((event) => {
                          return (
                            <SelectItem
                              key={event}
                              value={event}
                              className="capitalize"
                            >
                              {event}
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
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Event Location"
                        type="text"
                        autoCapitalize="none"
                        autoComplete="off"
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
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date / Time</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value.toISOString()}
                        onChange={(date) => field.onChange(new Date(date))}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date / Time</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value ? field.value?.toISOString() : ""}
                        onChange={(date) => field.onChange(new Date(date))}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" variant="rainbow" className="mt-4" disabled={form.formState.isSubmitting}>
              Create Event
            </Button>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="import-events">
        <div className="p-4 bg-card rounded-lg">
          <h3 className="text-base font-semibold">Import Events</h3>
          <p className="text-xs text-muted-foreground mb-4">
            This uses AI to import events from a image and add them to the
            calendar. You can upload a screenshot of the events or a document
          </p>
          <div className="grid grid-cols-1 max-w-sm gap-2 mb-4">
            <Label htmlFor="file-upload">
              Upload a reference image or document
            </Label>
            <Input
              type="file" accept="image/*" name="file-upload"
              id="file-upload"
              onChange={handleInputChange}
              placeholder="Upload an image"
            />
            <p>
              <Badge size="sm">
                {fileReference ? "File loaded successfully" : "No file loaded"}
              </Badge>
            </p>
          </div>
          <div className="inline-flex items-center gap-2 mb-4">
            <Button size="sm" variant="rainbow"
              transition="damped"
              disabled={!fileReference || generatingEvents}
              onClick={() => generateEvents()}>
              {generatingEvents ? <Loader2 className="animate-spin" /> : null}
              {generatingEvents ? " Generating..." : "Generate Events"}
            </Button>
            <Button size="sm" variant="ghost" disabled={!fileReference} onClick={() => setFileReference(null)}>
              Remove Reference
            </Button>
          </div>
          {generatedEvents && <div className="space-y-3 @container">
            <div className="w-full flex items-center justify-between gap-2">
              <Label className="text-sm font-semibold">Generated Events</Label>
              <Button
                variant="rainbow"
                size="xs"
                disabled={acceptedIndices.length === generatedEvents.length}
                onClick={() => {
                  // accept all events
                  if (acceptedIndices.length === generatedEvents.length) {
                    toast.error("All events already accepted");
                    return;
                  }
                  setAcceptedIndices(
                    Array.from({ length: generatedEvents.length }, (_, i) => i)
                  );
                }}
              >
                Accept All Events
              </Button>
            </div>
            <ResponsiveContainer>
              {generatedEvents.map((event, index) => {
                return (
                  <div key={index} className="p-3 space-y-1">
                    <EventCard
                      event={event}
                    />
                    <div className="flex items-center gap-2 p-2">
                      <Button
                        variant="rainbow"
                        size="xs"
                        disabled={acceptedIndices.includes(index)}
                        onClick={() => {
                          // insert the event into accepted events
                          if (acceptedIndices.includes(index)) {
                            toast.error("Event already accepted");
                            return;
                          }
                          setAcceptedIndices((prev) => [...prev, index]);

                        }}
                      >
                        Accept Event
                      </Button>
                      <Button
                        variant="destructive"
                        size="xs"
                        disabled={!acceptedIndices.includes(index)}
                        onClick={() => {
                          // remove the event from accepted events
                          setAcceptedIndices((prev) =>
                            prev.filter((i) => i !== index)
                          );
                        }}
                      >
                        Remove Event
                      </Button>
                    </div>
                  </div>
                )
              })}
            </ResponsiveContainer>
            <Button
              variant="rainbow"
              className="mt-4"
              onClick={() => saveAcceptedEvents()}
              transition="damped"
              disabled={generatingEvents || acceptedIndices.length === 0 || savingEvents}
            >
              {savingEvents ? <Loader2 className="animate-spin" /> : null}
              {savingEvents ? " Saving..." : "Save Accepted Events"}
            </Button>
          </div>}
        </div>
      </TabsContent>
    </Tabs>
  );
}
