import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Clock } from "lucide-react";
import Link from "next/link";
import { BiUpvote } from "react-icons/bi";
import type { PollType } from "src/models/poll";
import type { Session } from "~/auth/client";
import DeletePoll from "./delete-poll";
import { ClosingBadge } from "./poll-timer";

export default function PollComponent({
  poll,
  user,
}: {
  poll: PollType;
  user?: Session["user"];
}) {
  const closesAlready = new Date(poll.closesAt) < new Date();

  return (
    <div className="bg-card p-4 rounded-lg mt-2 flex flex-col justify-between items-stretch gap-3 border hover:shadow-sm relative">
      <div>
        <h3 className="text-xl font-medium text-card-foreground">
          {poll.question}
        </h3>
        <p className="text-sm text-muted-foreground">{poll.description}</p>
        <div className="flex items-center gap-2">
          <h1 className="text-sm text-muted-foreground">
            by{" "}
            <Link
              className="text-foreground hover:underline"
              href={`/u/${poll?.createdBy}`}
            >
              @{poll?.createdBy}
            </Link>
          </h1>
          <p className="text-sm text-muted-foreground">
            {poll?.createdAt
              ? new Date(poll.createdAt).toLocaleString("default", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
              : ""}
          </p>
        </div>
      </div>
      <PollRender poll={poll} user={user} />
      <div className="w-full flex items-center gap-2 flex-wrap">
        <span className="rounded-md bg-muted text-muted-foreground px-2 py-1 text-xs inline-flex items-center whitespace-nowrap">
          <BiUpvote className="mr-1 inline-block size-4" />
          {poll.votes.length} votes
        </span>
        <span className="rounded-md bg-muted text-muted-foreground px-2 py-1 text-xs inline-flex items-center">
          <Clock className="mr-1 inline-block size-3" />
          <ClosingBadge poll={poll} />
        </span>
      </div>
      <div className="w-full flex items-center justify-end gap-2">
        {user?.id === poll.createdBy && <DeletePoll pollId={poll._id} />}
        {!closesAlready && (
          <Button variant="dark" size="sm" effect="shineHover" asChild>
            <Link href={`/polls/${poll._id}`}>
              Vote
              <ArrowRight />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
export function PollRender({ poll, user }: { poll: PollType, user?: Session["user"] }) {
  return (
    <div className="grid gap-2 mt-5 w-full">
      {poll.options
        .map((option, index) => {
          const { percent, count } = parseVotes(poll.votes, option);
          const { disabled, message, btnText, voted } = notAllowed(
            poll.votes,
            poll.multipleChoice,
            option,
            user
          );
          return (
            <Button
              aria-label={`Vote for ${option}`}
              disabled={disabled}
              variant="outline"
              key={index}
              transition="none"
              className="cursor-default disabled:opacity-80 flex gap-2 items-center justify-between relative z-10 bg-none after:rounded-md after:h-full after:absolute after:bottom-0 after:left-0 after:-z-10 after:bg-secondary after:text-secondary-foreground after:w-[var(--vote-width)]"
              style={{
                "--vote-width": `${count > 0 ? Math.max(1, percent) : 0}%`,
              } as React.CSSProperties}
            >
              <div className="flex items-center gap-2">
                {voted && <Check className="h-4 w-4" />}
                <p className="text-sm">{option}</p>
              </div>

              <p className="text-sm opacity-80">{percent}%</p>
            </Button>
          );
        })}
    </div>
  );
}
function notAllowed(
  voteData: PollType["votes"],
  multipleChoice: boolean,
  option: string,
  user?: Session["user"],
) {
  if (!user) {
    return {
      disabled: true,
      message: "You need to be logged in to vote",
      btnText: "Login to Vote",
      voted: false,
    };
  }
  switch (true) {
    case !multipleChoice:
      return {
        disabled: voteData?.some((vote) => vote.userId === user.id),
        message: "You can only vote once",
        btnText: voteData?.some((vote) => vote.userId === user.id)
          ? "Voted"
          : "Vote",
        voted: voteData?.some((vote) => vote.userId === user.id),
      };
    case !multipleChoice && voteData?.some((vote) => vote.userId === user.id):
      return {
        disabled: true,
        message: "You can only vote once",
        btnText: voteData?.some((vote) => vote.userId === user.id)
          ? "Voted"
          : "Vote",
        voted: voteData?.some((vote) => vote.userId === user.id),
      };
    case multipleChoice &&
      voteData?.some(
        (vote) => vote.userId === user.id && vote.option === option
      ):
      return {
        disabled: true,
        message: "You have already voted",
        btnText: voteData?.some(
          (vote) => vote.userId === user.id && vote.option === option
        )
          ? "Voted"
          : "Vote",
        voted: voteData?.some(
          (vote) => vote.userId === user.id && vote.option === option
        ),
      };
    default:
      return {
        disabled: false,
        message: "",
        btnText: "Vote",
        voted: false,
      };
  }
}
function parseVotes(votes: PollType["votes"], option: string) {
  const count = votes?.filter((vote) => vote.option === option).length || 0;
  const percent = votes && votes.length > 0 ? (count / votes.length) * 100 : 0;
  return { option, count, percent };
}
