import { cn } from "@/lib/utils";
import Link from "next/link";
import { CATEGORY_TYPES } from "src/models/community";

export default async function Dashboard() {

    return (
        <div className="grid grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-4 place-items-center rounded-md bg-muted text-muted-foreground w-full p-2">
            {CATEGORY_TYPES.map((category) => {
                return <Link href={`/community/${category}`}
                    className={cn(
                        "inline-flex items-center justify-center whitespace-nowrap rounded-sm p-4 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-md w-full capitalize",
                        "hover:bg-background/40 hover:text-gray-800 hover:shadow-sm"
                    )}
                    key={category}>
                    {category}
                </Link>
            })}
        </div>
    );
}
