import { getSession } from "src/lib/auth";
import { sessionType } from "src/types/session";

export default async function Dashboard() {
    const session = await getSession() as sessionType;

    return (
        <>
            <section id="hero" className="z-10 w-full max-w-6xl relative flex flex-col items-center justify-center  py-24 max-h-80 text-center">
                <h2 className="text-xl md:text-2xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 whitespace-nowrap" data-aos="fade-up">
                    Welcome back, <span className="text-primary">{session.user.firstName}</span>
                </h2>
                <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-300">
                </p>
            </section>

        </>
    );
}
