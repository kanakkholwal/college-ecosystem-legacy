"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ErrorPage() {
    const router = useRouter();


    return <div className="min-h-screen w-full p-5 flex justify-between items-stretch bg-white ">

        <div className="flex flex-col justify-center items-center p-4 w-full h-screen">
            <Image src="/assets/images/404.svg" width={500} height={500} alt="Not found | Socially Bio"
                className="object-contain w-full h-auto max-w-6xl mix-blend-multiply max-h-96"
            />

            <h4 className="text-4xl font-semibold text-slate-900">
                Page not found

            </h4>
            <p className="text-md font-regular  mt-5">
                The page you are looking for doesn't exist or has been moved.

            </p>
            <div className="mt-5 flex justify-center items-center gap-3">
                <Button className="bg-primary text-white hover:bg-primary/70"
                    onClick={() => router.back()}
                >
                    Go Back
                </Button>
                <Button className="bg-slate-900 text-white hover:bg-slate-800" asChild>
                    <Link href="https://app.nith.eu.org" target="_blank" rel="noopener noreferrer" >
                        Go to New App
                    </Link>
                </Button>
            </div>
        </div>

    </div>
}