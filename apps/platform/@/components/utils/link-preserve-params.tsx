"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { appConfig } from "~/project.config";

export type ParamsPreserverLinkProps = React.ComponentProps<typeof Link> & {
  preserveParams?: boolean;
};

export default function ParamsPreserverLink({
  href,
  preserveParams = false,
  ...props
}: ParamsPreserverLinkProps) {
  const searchParams = useSearchParams();
  const url = new URL(href.toString(), appConfig.env.baseUrl);
  if (preserveParams) url.search = searchParams.toString();

  return <Link href={url?.toString()} {...props} />;
}
