import { MdOutlineChair } from "react-icons/md";


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

    return <>

        {rooms.map((room) => {
            return <RoomCard key={room._id} room={room} onClick={() => console.log(room)} />
        })}
    </>
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