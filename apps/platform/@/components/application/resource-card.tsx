import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { appConfig } from "~/project.config";

export interface ResourceCardProps {
    type: string;
    title: string;
    slug: string;
    summary?: string;
    tags?: string[];
    coverImage?: string;
    date: string;
    readingTime?: string;
    category?: string;
}

export default function ResourceCard({
    type,
    title,
    slug,
    summary,
    tags = [],
    coverImage,
    date,
    readingTime,
    category,
}: ResourceCardProps) {
    return (
        <Link href={`/resources/${type}/${slug}`} className="block group">
            <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 transition-all duration-500 ease-in-out">
                {(coverImage || appConfig.flags.enableOgImage) && (
                    <div className="relative h-52 w-full aspect-video overflow-hidden">
                        <Image
                            src={coverImage || `/og/resources/${type}/${slug}`}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                )}
                <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{new Date(date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}</span>
                        {readingTime && <span>{readingTime}</span>}
                    </div>

                    <h2 className="text-lg font-semibold line-clamp-2">{title}</h2>
                    {summary && <p className="text-muted-foreground text-sm line-clamp-3">{summary}</p>}

                    <div className="flex flex-wrap gap-1 pt-2">
                        {category && (
                            <Badge variant="default_light" className="text-xs capitalize">
                                {category}
                            </Badge>
                        )}
                        {tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="default" className="text-xs">
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}