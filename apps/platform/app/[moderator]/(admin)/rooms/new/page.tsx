import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";
import { createRoom } from "~/actions/room";
import CreateRoomForm from "./form";

export const metadata: Metadata = {
  title: "New Room | Dashboard",
  description: "Add a new room to the database",
};

export default async function CoursesPage() {
  return (
    <>
      <Card className="m-4 mt-10">
        <CardHeader>
          <CardTitle>New Room</CardTitle>
          <CardDescription>Add a new room</CardDescription>
        </CardHeader>
        <CreateRoomForm onSubmit={createRoom} />
      </Card>
    </>
  );
}
