"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";


export function RedirectButton() {
    const searchParams = useSearchParams();
    return (
        <Button rounded="full" variant="default_light" width="sm" effect="shineHover" asChild>
            <Link href={`/sign-in?${searchParams.toString()}`}>
                Sign In
                <ArrowRight />
            </Link>
        </Button>
    );
}