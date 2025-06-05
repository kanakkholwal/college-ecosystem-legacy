import { cn } from "@/lib/utils";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Star } from "lucide-react";
import Link from "next/link";
import { appConfig } from "~/project.config";
import { NumberTicker } from "../animation/number-ticker";
import { Button } from "../ui/button";

async function getStarGazers(): Promise<number> {
  let stars = 6; // Default value

  try {
    const response = await fetch(
      "https://api.github.com/repos/" + appConfig.githubUri,
      {
        headers: process.env.GITHUB_OAUTH_TOKEN
          ? {
              Authorization: `Bearer ${process.env.GITHUB_OAUTH_TOKEN}`,
              "Content-Type": "application/json",
            }
          : {},
        next: {
          revalidate: 3600,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      stars = data.stargazers_count || stars; // Update stars if API response is valid
    }
  } catch (error) {
    console.error("Error fetching GitHub stars:", error);
  }
  return stars;
}

export default async function GithubStars({
  className,
}: {
  className?: string;
}) {
  const stargazers_count = await getStarGazers();

  return (
    <Button variant="rainbow" size="sm" className={cn(className)} asChild>
      <Link href={appConfig.githubRepo} target="_blank">
        <GitHubLogoIcon className="size-4" />
        <span className="ml-1 lg:hidden">Star</span>
        <span className="ml-1 hidden lg:inline">Star on GitHub</span>{" "}
        <Star className="size-4 transition-all duration-300 group-hover:text-yellow-300" />
        <NumberTicker
          value={stargazers_count}
          className="font-display font-medium text-white dark:text-black"
        />
      </Link>
    </Button>
  );
}
