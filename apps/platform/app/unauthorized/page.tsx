import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import NotFoundImg from "./404.svg";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Not Authorized | College Platform",
    description: "The page you are looking for does not exist.",
};

export default function NotAuthorized() {
    return (
        <>
            <div className="flex flex-col justify-center items-center p-4 w-full h-full gap-4 py-36">
                <h2 className="text-5xl font-bold text-slate-900 dark:text-gray-100 text-center">
                    Stop right there!
                </h2>
                <p className="text-md  text-gray-700 dark:text-gray-400 mt-5 text-center">
                    You are not authorized to view this page. Please login to continue.
                </p>
                <Image
                    className="w-full h-80 my-4"
                    src={NotFoundImg}
                    alt="404"
                    height={500}
                    width={500}
                />
                <div className="flex mx-auto gap-4">
                    <Button
                        rounded="full"
                        variant="default_light"
                        width="sm"
                        asChild
                    >
                        <Link href="/sign-in">
                            Sign IN
                        </Link>
                    </Button>
                    <Button
                        rounded="full"
                        variant="default_light"
                        width="sm"
                        asChild
                    >
                        <Link href="/">
                            <Home />
                            Go to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
