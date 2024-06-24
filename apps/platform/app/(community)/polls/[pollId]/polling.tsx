"use client";

import { Button } from "@/components/ui/button";
import { onValue, ref, set } from "firebase/database";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { database } from "src/lib/firebase";

import { PollType } from "src/models/poll";
import { sessionType } from "src/types/session";

interface PollingProps {
  poll: PollType;
  user: sessionType["user"];
  updateVotes: (voteData: PollType["votes"]) => Promise<PollType>;
}

export default function Polling({ poll, user, updateVotes }: PollingProps) {
  const [voteData, setVoteData] = useState<PollType["votes"]>(poll.votes);

  const handleVote = (option: string) => {
    if (voteData) {
      let updatedVotes = [...voteData];
      const existingVoteIndex = updatedVotes.findIndex(
        (vote) => vote.userId === user._id && vote.option === option
      );

      if (existingVoteIndex > -1) {
        if (!poll.multipleChoice) {
          updatedVotes.splice(existingVoteIndex, 1);
        }
      } else {
        if (!poll.multipleChoice) {
          updatedVotes = updatedVotes.filter(
            (vote) => vote.userId !== user._id
          );
        }
        updatedVotes.push({ option, userId: user._id });
      }

      set(ref(database, `polls/${poll._id}/votes`), updatedVotes);
      setVoteData(updatedVotes);
    }
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
    const pollRef = ref(database, `polls/${poll._id}`);
    const unsubscribe = onValue(pollRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setVoteData(data.votes || []);
      }
    });

    return () => {
      handleSync();
      unsubscribe();
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
          <div key={`${option}-${index}`} className="relative bg-white/20">
            <div
              className="z-[-1] h-full bg-primary/20 rounded-lg absolute top-0 bottom-0 left-0 right-auto transition-all bg-opacity-40 dark:bg-dark-primary/20"
              style={{ width: `${percent}%` }}
            />
            <div className="grid gap-2  p-4 w-full h-full">
              <h3 className="text-xl font-semibold">{option}</h3>
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold">{percent.toFixed(2)}%</p>
                <p className="text-sm font-semibold text-primary">
                  {count} votes
                </p>
              </div>
              <Button
                width="full"
                className="z-10"
                disabled={disabled}
                onClick={() => {
                  if (disabled) {
                    toast.error(message);
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

function notAllowed(
  voteData: PollType["votes"],
  multipleChoice: boolean,
  user: sessionType["user"],
  option: string
) {
  switch (true) {
    case !multipleChoice:
      return {
        disabled: voteData?.some((vote) => vote.userId === user._id),
        message: "You can only vote once",
        btnText: voteData?.some((vote) => vote.userId === user._id)
          ? "Voted"
          : "Vote",
      };
    case !multipleChoice && voteData?.some((vote) => vote.userId === user._id):
      return {
        disabled: true,
        message: "You can only vote once",
        btnText: voteData?.some((vote) => vote.userId === user._id)
          ? "Voted"
          : "Vote",
      };
    case multipleChoice &&
      voteData?.some(
        (vote) => vote.userId === user._id && vote.option === option
      ):
      return {
        disabled: true,
        message: "You have already voted",
        btnText: voteData?.some(
          (vote) => vote.userId === user._id && vote.option === option
        )
          ? "Voted"
          : "Vote",
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
