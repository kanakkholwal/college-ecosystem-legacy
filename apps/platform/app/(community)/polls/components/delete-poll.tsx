"use client";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { ref, remove } from "firebase/database";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { database } from "src/lib/firebase";
import { deletePoll } from "src/lib/poll/actions";
import type { PollType } from "src/models/poll";

export default function DeletePoll({ pollId }: { pollId: PollType["_id"] }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    toast
      .promise(deletePoll(pollId), {
        loading: "Deleting poll...",
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        success: (data: any) => {
          remove(ref(database, `polls/${pollId}`))
            .catch((err) => {
              console.log("err while removing from firebase : ", err);
            })
            .finally(() => {
              return "Poll deleted successfully";
            });
          return "Poll deleted successfully";
        },
        error: "Failed to delete poll",
      })
      .finally(() => setLoading(false));
  };

  return (
    <ResponsiveDialog
      title="Delete Poll"
      description="Are you sure you want to delete this poll?"
      btnProps={{
        variant: "destructive_light",
        children: <Trash2 />,
        size: "icon_sm",
        className:"absolute right-4 top-4",
      }}
    >
      <Button
        variant="destructive"
        width="full"
        disabled={loading}
        onClick={handleDelete}
      >
        {loading ? "Deleting..." : "Delete Poll"}
      </Button>
    </ResponsiveDialog>
  );
}
