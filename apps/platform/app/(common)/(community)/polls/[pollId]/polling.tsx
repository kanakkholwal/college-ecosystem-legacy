"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { CircleCheckBig, MousePointerClick } from "lucide-react";
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
      // User already voted on this option
      if (!poll.multipleChoice) {
        updatedVotes.splice(existingVoteIndex, 1);
      }
    } else {
      if (!poll.multipleChoice) {
        updatedVotes = updatedVotes.filter((vote) => vote.userId !== user.id);
      }
      updatedVotes.push({ option, userId: user.id });
    }

    const { error } = await supabase
      .from("polls")
      .update({ votes: updatedVotes })
      .eq("id", poll._id);

    if (error) {
      toast.error("Failed to submit vote");
      return;
    }

    setVoteData(updatedVotes);
  };

  const handleSync = useCallback(async () => {
    try {
      await updateVotes(voteData);
    } catch (error) {
      console.error("Error updating poll:", error);
    }
  }, [updateVotes, voteData]);

  useEffect(() => {
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
    <div className="space-y-4">
      {poll.options.map((option, index) => {
        const totalVotes = voteData.length || 1;
        const count = voteData.filter((v) => v.option === option).length;
        const percent = (count / totalVotes) * 100;

        const hasVoted = voteData.some(
          (v) => v.userId === user.id && v.option === option
        );

        return (
          <motion.div
            key={`${option}-${index}`}
            className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Progress Bar */}
            <motion.div
              className={`absolute inset-y-0 left-0 bg-primary/20`}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />

            <div className="relative z-10 p-4 flex flex-col gap-3">
              {/* Option Text */}
              <h3 className="text-base font-semibold tracking-tight">
                {option}
              </h3>

              {/* Stats */}
              <div className="flex items-center justify-between">
                <div className="flex gap-3 text-sm">
                  <span className="text-muted-foreground font-medium">
                    {percent.toFixed(1)}%
                  </span>
                  <span className="font-semibold text-primary">{count} votes</span>
                </div>


                {/* Vote Button */}
                <Button 
                  size="sm"
                  variant={hasVoted ? "default" : "outline"}
                  shadow="none"
                  onClick={() => handleVote(option)}
                >
                  {hasVoted ? (
                    <CircleCheckBig  className="shrink-0" />
                  ) : (
                    <MousePointerClick className="shrink-0" />
                  )}
                  <span>{hasVoted ? "You Backed This" : "Back This"}</span>
                </Button>
              </div>
            </div>
          </motion.div>
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
