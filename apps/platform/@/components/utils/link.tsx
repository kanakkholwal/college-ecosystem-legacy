"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface RedirectButtonProps extends ButtonProps {
    href: string;
    children?: React.ReactNode;
}
export function RedirectWithSearchParamsLink({ href, children, ...props }: RedirectButtonProps) {
    const searchParams = useSearchParams();
    const url = new URL(href, process.env.NEXT_PUBLIC_BASE_URL);
    searchParams.entries().forEach(([key, value]) => {
        url.searchParams.append(key, value);
    })
    return (
        <Button
            rounded="full"
            variant="default_light"
            width="sm"
            effect="shineHover"
            {...props}
            asChild
        >
            <Link href={url.toString()}>
                {children}
            </Link>
        </Button>
    );
}
export function PreviousPageLink({ ...props }: ButtonProps) {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <Button
            rounded="full"
            variant="ghost"
            onClick={() => {
                window?.history?.length > 1
                    ? router.back()
                    : router.push(pathname.split("/").splice(-1).join("/"));
            }}
            {...props}
        >
            <ArrowLeft />
            Go Back
        </Button>
    );
}

export function ButtonLink({ href, children, ...props }: React.ComponentProps<typeof Button> & React.ComponentProps<typeof Link>) {
    return (
        <Button asChild {...props}>
            <Link href={href}>
                {children}
            </Link>
        </Button>
    );
}
export function AuthButtonLink({ href, authorized, children, ...props }: React.ComponentProps<typeof Button> & React.ComponentProps<typeof Link> & {
    authorized?: boolean;
}) {
    return (
        <Button asChild {...props}>
            <Link href={authorized ? href : `/sign-in?next=${href}`}>
                {children}
            </Link>
        </Button>
    );
}


export type ParamsPreserverLinkProps = React.ComponentProps<typeof Link> & {
    preserveParams?: boolean;
};

export function ParamsPreserverLink({
    href,
    preserveParams = false,
    ...props
}: ParamsPreserverLinkProps) {
    const searchParams = useSearchParams();
    const url = new URL(href.toString(), process.env.NEXT_PUBLIC_BASE_URL);
    if (preserveParams) url.search = searchParams.toString();

    return <Link href={url?.toString()} {...props} />;
}
