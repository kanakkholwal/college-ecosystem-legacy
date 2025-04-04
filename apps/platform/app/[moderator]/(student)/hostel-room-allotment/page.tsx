import EmptyArea from "@/components/common/empty-area";
import ConditionalRender from "@/components/utils/conditional-render";
import { MdOutlineChair } from "react-icons/md";
import { getAllotmentProcess } from "~/actions/allotment-process";
import { getHostelByUser } from "~/actions/hostel";
import { getSession } from "~/lib/auth-server";

type HostelRoomType = {
    _id: string;
    name: string;
    capacity: number;
    available: number;
    isLocked: boolean;
}

const rooms: HostelRoomType[] = [
    {
        _id: "1",
        name: "Room 101",
        capacity: 4,
        available: 2,
        isLocked: false,
    },
    {
        _id: "2",
        name: "Room 102",
        capacity: 4,
        available: 0,
        isLocked: true,
    },
    {
        _id: "3",
        name: "Room 103",
        capacity: 4,
        available: 1,
        isLocked: false,
    },
]

export default async function HostelRoomAllotmentPage() {
    const session = await getSession();
    const { hostel } = await getHostelByUser();
    if (!hostel) {
        return <div className="text-center text-gray-500">No hostel found</div>
    }
    const allotmentProcess = await getAllotmentProcess(hostel._id);

    return <div className="space-y-5 my-2">

        <ConditionalRender condition={allotmentProcess?.status === "closed"}>
            <EmptyArea
                title="Allotment Process Closed"
                description="Allotment process is closed for this hostel"
            />
        </ConditionalRender>

        <ConditionalRender condition={allotmentProcess?.status === "paused"}>
            <EmptyArea
                title="Allotment Process Paused"
                description="Allotment process is paused for this hostel for some reason"
            />
        </ConditionalRender>

        <ConditionalRender condition={allotmentProcess?.status === "completed"}>
            <EmptyArea
                title="Allotment Process Completed"
                description="Allotment process is completed for this hostel"
            />
        </ConditionalRender>

        <ConditionalRender condition={allotmentProcess?.status === "waiting"}>
            <EmptyArea
                title="Allotment Process Waiting"
                description="Allotment process is waiting for the admin to start the process"
            />
        </ConditionalRender>




        <ConditionalRender condition={allotmentProcess?.status === "open"}>

            <div>
                <h2 className="text-2xl font-bold">Hostel Room Allotment</h2>
                <p className="text-gray-500">Select a room to view details and allotment options.</p>

            </div>

            {rooms.map((room) => {
                return <RoomCard key={room._id} room={room} onClick={() => console.log(room)} />
            })}
        </ConditionalRender>

    </div>
}

type RoomCardProps = {
    room: HostelRoomType
    onClick?: () => void;
}

function RoomCard({ room, onClick }: RoomCardProps) {

    return (<div className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300">
        <div>
            <h6 className="text-base font-semibold">{room.name}</h6>
            <p className="text-gray-500 text-sm">Capacity: {room.capacity}</p>
        </div>
        <div className="flex items-center mt-2">
            {Array.from({ length: room.capacity }).map((_, index) => {
                return <MdOutlineChair key={`room.${index.toString()}`} className={`text-gray-500 ${index < room.available ? 'text-green-500' : 'text-gray-500'}`} />
            })}
        </div>
        <div className="mt-2">
            <span className={`text-sm ${room.isLocked ? 'text-red-500' : 'text-green-500'}`}>
                {room.isLocked ? 'Locked' : 'Unlocked'}
            </span>
        </div>

    </div>)
}