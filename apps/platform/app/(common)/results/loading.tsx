import { SkeletonCard } from "@/components/application/result-card";
import { Skeleton } from "@/components/ui/skeleton";



export default function LoadingResultPage() {

    return (
        <>
            <section
                id="hero"
                className="z-10 w-full max-w-6xl mx-auto  relative flex flex-col items-center justify-center  py-24 max-h-80 text-center"
                >
                <h2 className="text-3xl font-semibold text-center whitespace-nowrap">

                    NITH{" "}
                    <span className="relative bg-gradient-to-r from-primary to-violet-200 bg-clip-text text-transparent dark:from-primaryLight dark:to-secondaryLight md:px-2">
                        Result
                    </span>
                    Portal
                </h2>
                <p
                    className="mt-4 mb-8 text-lg text-muted-foreground">
                    NITH Portal is a platform for students of NITH to get all the
                    resources at one place.
                </p>
                <div
                    className="mt-10 flex flex-wrap justify-center gap-y-4 gap-x-6 w-full mx-auto max-w-2xl"
                    data-aos="fade-up"
                    data-aos-anchor-placement="center-bottom"
                >
                    <Skeleton className="h-12 w-full " />
                </div>
            </section>
            <div className="mx-auto max-w-7xl w-full xl:px-6 grid gap-4 grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 @5xl:grid-cols-4">
                {[...Array(6)].map((_, i) => {
                    return <SkeletonCard key={i.toString()} />;
                })}
            </div>
        </>
    );
}
