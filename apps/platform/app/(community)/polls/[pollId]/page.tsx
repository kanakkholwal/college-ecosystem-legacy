import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Info } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "src/lib/auth-server";
import { getPollById, updateVotes } from "src/lib/poll/actions";
import { PollRender } from "../components/poll-component";
import Polling from "./polling";

import type { Metadata } from "next";
import { ClosingBadge } from "../components/poll-timer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pollId: string }>;
}): Promise<Metadata> {
  const { pollId } = await params;
  const poll = await getPollById(pollId);

  if (!poll) return notFound();

  return {
    title: `${poll.question}`,
    description: `${poll?.description?.substring(0, 160)}...`,
    openGraph: {
      type: "website",
      title: `${poll.question}`,
      description: `${poll?.description?.substring(0, 160)}...`,
      siteName: process.env.NEXTAUTH_URL,
      url: `${process.env.NEXTAUTH_URL}/polls/${pollId}`,
    },
  };
}

interface Props {
  params: Promise<{
    pollId: string;
  }>;
}

export default async function Dashboard({ params }: Props) {
  const session = await getSession();
  const { pollId } = await params;
  const poll = await getPollById(pollId);
  if (!poll) {
    return notFound();
  }
  console.log(poll);

  const closesAlready = new Date(poll.closesAt) < new Date();

  return (
    <div className="max-w-6xl mx-auto w-full grid justify-start items-start gap-4 grid-cols-1">
      <div>
        <Button variant="link" size="sm" asChild>
          <Link href="/polls">
            <ArrowLeft />
            Back to Polls
          </Link>
        </Button>
      </div>
      <div className="w-full flex flex-col justify-start whitespace-nowrap gap-2 bg-card border rounded-lg p-6">
        <div>
          <h3 className="text-lg font-semibold">{poll.question}</h3>
          <p className="text-sm text-muted-foreground">{poll.description}</p>
        </div>
        <div className="space-x-3">
          <span className="rounded-md bg-muted text-muted-foreground px-2 py-1 text-xs inline-flex items-center">
            <Info className="mr-1 inline-block size-3" />
            {poll.multipleChoice ? "Multiple choice" : "Single choice"}
          </span>
          <span className="rounded-md bg-muted text-muted-foreground px-2 py-1 text-xs inline-flex items-center">
            <Clock className="mr-1 inline-block size-3" />
            <ClosingBadge poll={poll} />
          </span>
          {closesAlready && (
            <Badge variant="destructive_light">Poll closed</Badge>
          )}
        </div>
        {closesAlready ? (
          <PollRender poll={poll} />
        ) : (
          session?.user && (
            <Polling
              poll={poll}
              user={session.user}
              updateVotes={updateVotes.bind(null, poll._id)}
            />
          )
        )}
      </div>
    </div>
  );
}
