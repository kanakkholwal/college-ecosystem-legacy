import { SocialBar, SupportBar } from "@/components/common/navbar";
import { ApplicationInfo } from "@/components/logo";
import { Metadata } from "next";
import { appConfig } from "~/project.config";


export const metadata: Metadata = {
    title: "About Us",
    description: "Learn more about our platform and its features.",
    alternates: {
        canonical: "/about",
    },
};

export default function AboutPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full p-4 my-10">
            <div className="p-6 bg-card backdrop-blur-3xl shadow-2xl rounded-2xl">
                <ApplicationInfo className="w-full inline-flex gap-2" />
                <p className="text-left text-sm text-pretty max-w-2xl text-card-foreground">
                    {appConfig.description}
                </p>
                <h4 className="mt-4 text-sm font-semibold text-pretty">
                    Developed by
                </h4>
                <div className="inline-flex gap-1">
                    {appConfig.authors.map((author, index) => (
                        <a href={author.url} key={index} target="_blank" rel="noopener noreferrer" className="hover:underline text-sm text-primary">
                            {author.name}
                        </a>
                    ))}
                </div>
                <div className="inline-flex gap-1">

                    <SocialBar />
                    <SupportBar />
                </div>
            </div>
        </div>
    );
}