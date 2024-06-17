import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { ArrowRight, ArrowUpRight, CircleDashed, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getSession } from "src/lib/auth";
import { sessionType } from "src/types/session";
import { users_CountAndGrowth } from "./actions";



export default async function Dashboard() {
    const session = await getSession() as sessionType;
    const { count: userCount, growth: userGrowth, trend: userTrend } = await users_CountAndGrowth("this_month");
    return (<div className="space-y-6 my-5">
    <div>
        <h2 className="text-3xl font-semibold mb-2">
            Hi, {session.user.firstName}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
            Let's check out your Platform today!
        </p>
    </div>
    <div className="flex justify-between gap-2 w-full flex-col lg:flex-row">
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle>
                            Total Users
                        </CardTitle>
                        <CardDescription>
                            <span className={(userTrend === "increase" ? "text-green-500" : userTrend === "decrease" ? "text-red-500" : "text-primary/80") + " text-base"}>
                                {userTrend === "increase" ? <TrendingUp size={20} className="inline-block mr-2" /> : userTrend === "decrease" ? <TrendingDown size={20} className="inline-block mr-2" /> : <CircleDashed size={20} className="inline-block mr-2" />}
                                {userGrowth?.toFixed(2)}%
                            </span> from last month
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-5xl font-semibold">
                            {userCount}
                        </h3>
                    </CardContent>
                </Card>


            </div>
        </div>
        <div className="lg:w-1/3 p-3">
            {/* messages */}
            <h3 className="text-2xl font-semibold mb-2">
                Messages
            </h3>
            <div className="bg-white dark:bg-slate-800 px-4 py-10 rounded-lg text-center w-full">
                <p className="text-slate-600 dark:text-slate-400 mb-3">
                    You have no new messages.
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                    <Link href="/admin/messages" className="text-primary hover:underline">View all messages</Link>
                </p>
            </div>

        </div>
    </div>


</div>);
}

function getGreeting(): string {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
        return "Good morning!";
    } else if (currentHour >= 12 && currentHour < 18) {
        return "Good afternoon!";
    } else {
        return "Good evening!";
    }
}



interface RouterCardProps {
    href: string;
    title: string;
    description: string;
    external?: boolean;
    Icon: React.ElementType;
    style?: React.CSSProperties;
}

function RouterCard({ href, title, description, external = false, Icon, style }: RouterCardProps) {
    return (<Link
        href={href}
        className="group rounded-lg flex flex-col justify-between gap-3 border border-gray-50/30 px-5 py-4 animate-in popup  transition-colors backdrop-blur-2xl hover:bg-white/10 hover:shadow hover:border-primary/5"
        target={external ? "_blank" : "_self"}
        rel={external ? "noopener noreferrer" : undefined}
        style={style}
    >
        <h2 className="mtext-xl font-semibold">
            <Icon className="w-8 h-8 text-primary inline-block mr-2" />
            {title}{" "}
        </h2>
        <p className="max-w-[30ch] text-sm opacity-80">
            {description}
        </p>
        <p className="text-sm whitespace-nowrap font-semibold text-primary/80 transition-all group-hover:text-primary group-hover:translate-x-1 motion-reduce:transform-none">
            Go to {title}
            {external ? <ArrowUpRight className="w-4 h-4 ml-1 inline-block" /> : <ArrowRight className="w-4 h-4 ml-1 inline-block" />}
        </p>
    </Link>)
}