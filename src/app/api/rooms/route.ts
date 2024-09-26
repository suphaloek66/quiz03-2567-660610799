import { readDB, writeDB, originalDB, Room, Payload } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  return NextResponse.json({
    ok: true,
    rooms: originalDB.rooms,
    totalRooms: originalDB.rooms.length
  });
};

export const POST = async (request: NextRequest) => {
  const Room: { roomName: string } = await request.json();
  const payload: Payload | null = checkToken() as Payload | null;
  let role: string | null = null;
  try {
    role = payload?.role || null;
  } catch {
   return NextResponse.json(
     {
       ok: false,
       message: "Invalid token",
     },
     { status: 401 }
   );
  }
  readDB();
  if(role === "ADMIN" || role === "SUPER_ADMIN"){
    const foundDupe = originalDB.rooms.find((room: Room) => room.roomName === Room.roomName);
    if (foundDupe) {
   return NextResponse.json(
     {
       ok: false,
       message: `Room ${Room.roomName} already exists`,
     },
     { status: 400 }
   );
  }
  
  const roomId = nanoid();
  originalDB.rooms.push({ roomId: roomId, roomName: Room.roomName });

  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${Room.roomName} has been created`,
  });
}
return NextResponse.json(
  {
    ok: false,
    message: "Unauthorized",
  },
  { status: 403 }
);
};

