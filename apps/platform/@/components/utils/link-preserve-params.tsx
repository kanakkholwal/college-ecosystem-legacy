"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export type ParamsPreserverLinkProps = React.ComponentProps<typeof Link> & {
  preserveParams?: boolean;
};

export default function ParamsPreserverLink({
  href,
  preserveParams = false,
  ...props
}: ParamsPreserverLinkProps) {
  const searchParams = useSearchParams();
  const url = new URL(href.toString(), process.env.NEXT_PUBLIC_BASE_URL);
  if (preserveParams) url.search = searchParams.toString();

  return <Link href={url?.toString()} {...props} />;
}
