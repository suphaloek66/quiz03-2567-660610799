import { DB, readDB, writeDB, Message, Room , originalDB, Payload } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";



export const GET = async (request: NextRequest) => {
  const roomId = request.nextUrl.searchParams.get("roomId");
  readDB();
  const foundMesage = originalDB.messages.find((message:Message) => message.roomId === roomId);
  if(!foundMesage){
   return NextResponse.json(
     {
       ok: false,
       message: `Room is not found`,
     },
     { status: 404 }
   );
};
  let filtered = originalDB.messages;
    filtered = filtered.filter((messages :Message) => messages.roomId === roomId);

    return NextResponse.json({
    ok: true,
    messages: filtered,
  });
};


export const POST = async (request: NextRequest) => {
  const Room = await request.json();
  readDB();

  const foundRoom = originalDB.rooms.find((room:Room) => room.roomId === Room.roomId);
  if (!foundRoom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },{ 
        status: 404 
      });
  }

  const messageId = nanoid();
  originalDB.messages.push({
    roomId: Room.roomId,
    messageId: messageId,
    messageText: Room.messageText,
  });

  writeDB();


  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const Message = await request.json();
  const payload = checkToken();
  let role = null;

  try {
    role = (<Payload>payload).role;
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
  if (role === "SUPER_ADMIN") {
    const foundMesId = originalDB.messages.find(
      (message:Message) => message.messageId === Message.messageId
    );
    if (!foundMesId) {
   return NextResponse.json(
     {
      ok: false,
       message: "Message is not found",
     },
     { status: 404 });
    }

    originalDB.messages = originalDB.messages.filter(
      (messages:Message) => messages.messageId !== Message.messageId
    );
  writeDB();
  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
} else{
  return NextResponse.json(
    {
      ok: false,
      message: "Invalid token",
    },{ 
      status: 401 
    });
}
};
