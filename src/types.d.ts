type RoomType = "blue" | "red";

interface OnlineUser {
    id: string;
    username: string;
    room: RoomType
}


interface User {
    email: string;
    password: string;
}


namespace Express {
    interface Request {
        user?: User
    }
}