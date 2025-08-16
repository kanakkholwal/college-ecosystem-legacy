"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import type { PollType } from "src/models/poll";
import type { Session } from "~/auth/client";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PollingProps {
  poll: PollType;
  user: Session["user"];
  updateVotes: (voteData: PollType["votes"]) => Promise<PollType>;
}

export default function Polling({ poll, user, updateVotes }: PollingProps) {
  const [voteData, setVoteData] = useState<PollType["votes"]>(poll.votes);

  const handleVote = async (option: string) => {
    if (!voteData) return;

    let updatedVotes = [...voteData];
    const existingVoteIndex = updatedVotes.findIndex(
      (vote) => vote.userId === user.id && vote.option === option
    );

    if (existingVoteIndex > -1) {
      if (!poll.multipleChoice) {
        updatedVotes.splice(existingVoteIndex, 1);
      }
    } else {
      if (!poll.multipleChoice) {
        updatedVotes = updatedVotes.filter((vote) => vote.userId !== user.id);
      }
      updatedVotes.push({ option, userId: user.id });
    }

    // Update in Supabase
    const { error } = await supabase
      .from("polls")
      .update({ votes: updatedVotes })
      .eq("id", poll._id);

    if (error) {
      toast.error("Failed to submit vote");
      console.error(error);
      return;
    }

    setVoteData(updatedVotes);
  };

  const handleSync = useCallback(async () => {
    try {
      await updateVotes(voteData);
      console.log("Poll updated:", voteData);
    } catch (error) {
      console.error("Error updating poll:", error);
    }
  }, [updateVotes, voteData]);

  useEffect(() => {
    // Realtime subscription
    const channel = supabase
      .channel(`polls-${poll._id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "polls",
          filter: `id=eq.${poll._id}`,
        },
        (payload) => {
          const newData = payload.new as PollType;
          setVoteData(newData?.votes || []);
        }
      )
      .subscribe();

    return () => {
      handleSync();
      supabase.removeChannel(channel);
    };
  }, [handleSync, poll._id]);

  useEffect(() => {
    if (poll.votes.length !== voteData.length) {
      handleSync();
    }
  }, [handleSync, poll.votes.length, voteData.length]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {poll.options.map((option, index) => {
        const { disabled, message, btnText } = notAllowed(
          voteData,
          poll.multipleChoice,
          user,
          option
        );
        const { count, percent } = parseVotes(voteData, option);

        return (
          <div
            key={`${option}-${index}`}
            className="relative bg-muted rounded-lg"
          >
            <div
              className="flex items-center rounded transition-all h-full bg-primary/5 dark:bg-primary/10 absolute inset-0"
              style={{ width: `${percent}%` }}
            />
            <div className="grid gap-2 p-4 w-full h-full">
              <h3 className="text-lg font-semibold">{option}</h3>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-muted-foreground">
                  {percent.toFixed(2)}%
                </p>
                <p className="text-sm font-medium text-primary">
                  {count} votes
                </p>
              </div>
              <Button
                width="full"
                variant="dark"
                size="sm"
                className="z-10"
                disabled={disabled}
                onClick={() => {
                  if (disabled) {
                    message?.trim().length > 0 && toast.error(message);
                    return;
                  }
                  handleVote(option);
                }}
              >
                {btnText}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// utils
function notAllowed(
  voteData: PollType["votes"],
  multipleChoice: boolean,
  user: Session["user"],
  option: string
) {
  switch (true) {
    case !multipleChoice:
      return {
        disabled: voteData?.some((vote) => vote.userId === user.id),
        message: "You can only vote once",
        btnText: voteData?.some((vote) => vote.userId === user.id)
          ? "Voted"
          : "Vote",
      };
    case multipleChoice &&
      voteData?.some(
        (vote) => vote.userId === user.id && vote.option === option
      ):
      return {
        disabled: true,
        message: "You have already voted",
        btnText: "Voted",
      };
    default:
      return {
        disabled: false,
        message: "",
        btnText: "Vote",
      };
  }
}

function parseVotes(votes: PollType["votes"], option: string) {
  const count = votes?.filter((vote) => vote.option === option).length || 0;
  const percent = votes && votes.length > 0 ? (count / votes.length) * 100 : 0;
  return { option, count, percent };
}
