import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { RoomTypeWithId } from "src/models/room";



// Function to convert a date string to local time string + time ago format
function formatDateAgo(dateString: string): string {
    const date = parseISO(dateString);
    const localTimeString = date.toLocaleTimeString(); // Convert to local time string
    const timeAgo = formatDistanceToNow(date, { addSuffix: true }); // Calculate time ago

    return `${localTimeString} (${timeAgo})`;
}


export function RoomCardPublic({ room ,...props}: { room: RoomTypeWithId } & React.ComponentProps<typeof Card>) {
    return <Card variant="glass" className="hover:shadow-lg  animate-in popup"  {...props}>
        <CardHeader>
            <CardTitle>
                {room.roomNumber}
            </CardTitle>
            <CardDescription className="font-semibold text-sm text-gray-700">
                Last updated: {formatDateAgo(room.lastUpdatedTime.toString())}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex w-full flex-col md:flex-row md:justify-around gap-2">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-semibold text-slate-600">Capacity</span>
                    <Badge size="sm" className="uppercase" variant="default_light">{room.capacity}</Badge>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-semibold text-slate-600">Room Type</span>
                    <Badge size="sm" className="uppercase" variant="ghost">{room.roomType}</Badge>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-semibold text-slate-600">Current Status</span>
                    <Badge size="sm" className="uppercase"
                        variant={room.currentStatus === "available" ? "success" : "destructive"}
                    >{room.currentStatus}</Badge>
                </div>
            </div>
        </CardContent>

    </Card>
}