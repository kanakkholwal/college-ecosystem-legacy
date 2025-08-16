import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Icon } from "../icons";
import { ButtonLink } from "../utils/link";

export function UserPreview({ user, children }: { user: { name: string; image?: string; username: string, id: string }, children: React.ReactNode }) {
    return (
        <HoverCard openDelay={100} closeDelay={100}>
            <HoverCardTrigger className="cursor-pointer" asChild>
                {children}
            </HoverCardTrigger>
            <HoverCardContent className="max-w-50 p-2 bg-popover text-popover-foreground text-sm">
                <div className="flex justify-start gap-4">
                    <Avatar className="size-8 rounded-full">
                        <AvatarImage src={user.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user.name}`}
                            alt={user.name} height={30} width={30} />
                        <AvatarFallback>{user.name.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h4 className="text-sm font-medium">{user.name}</h4>
                        <div>
                            <ButtonLink href={`/u/${user.username}`} variant="link" size="xs">
                                @{user.username} <Icon name="arrow-right" />
                            </ButtonLink>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}