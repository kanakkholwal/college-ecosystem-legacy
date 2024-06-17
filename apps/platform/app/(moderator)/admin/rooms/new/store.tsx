import {
    RoomType
} from "src/models/room";


export const ACTION_TYPES = {
    SET_ROOM_NUMBER: 'SET_ROOM_NUMBER',
    SET_ROOM_TYPE: 'SET_ROOM_TYPE',
    SET_ROOM_CAPACITY: 'SET_ROOM_CAPACITY',
    SET_ROOM_STATUS: 'SET_ROOM_STATUS',
    
} as const;

type Action =
| { type: typeof ACTION_TYPES.SET_ROOM_NUMBER; roomNumber: string }
| { type: typeof ACTION_TYPES.SET_ROOM_TYPE; roomType: string }
| { type: typeof ACTION_TYPES.SET_ROOM_CAPACITY; capacity: number }
| { type: typeof ACTION_TYPES.SET_ROOM_STATUS; currentStatus: "available" |"occupied" }

export const roomFormReducer = (state: RoomType, action: Action): RoomType => {
    switch (action.type) {
        case ACTION_TYPES.SET_ROOM_NUMBER:
            return { ...state, roomNumber: action.roomNumber };
        case ACTION_TYPES.SET_ROOM_TYPE:
            return { ...state, roomType: action.roomType };
        case ACTION_TYPES.SET_ROOM_CAPACITY:
            return { ...state, capacity: action.capacity };
        case ACTION_TYPES.SET_ROOM_STATUS:
            return { ...state, currentStatus: action.currentStatus };
        default:
            return state;
    }
}
