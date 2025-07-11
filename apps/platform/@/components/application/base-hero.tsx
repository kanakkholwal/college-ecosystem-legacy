import { cn } from "@/lib/utils";

interface BaseHeroSectionProps {
    title?: string | React.ReactNode;
    description?: string;
    className?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    children?: React.ReactNode;
}
function BaseHeroSection(props: BaseHeroSectionProps) {
    return <section
        id="hero"
        className={cn("w-full max-w-6xl mx-auto relative flex flex-col items-center justify-center pt-20 pb-16 px-4 lg:px-8 max-h-80 text-center", props.className)}
    >
        <h2 className={cn("mb-2 text-2xl lg:text-4xl font-semibold text-center whitespace-nowrap bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent hover:from-sky-500 hover:to-primary", props.titleClassName)}>
            {props.title}
        </h2>
        <p className={cn("text-base text-muted-foreground max-w-4xl mx-auto", props.descriptionClassName)}>
            {props.description}
        </p>
        <div
            className="mt-6 flex flex-wrap justify-center gap-y-4 gap-x-6 w-full mx-auto max-w-2xl"
            data-aos="fade-up"
            data-aos-anchor-placement="center-bottom"
        >
            {props.children}
        </div>
    </section>
}
BaseHeroSection.displayName = "BaseHeroSection";
export { BaseHeroSection };

