import jwt from "jsonwebtoken";

import { DB, readDB, originalDB } from "@lib/DB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  
  const body: {username :string ; password:string } = await request.json();
  const { username , password } = body;

  readDB();

  const user  = originalDB.users.find(
    (user) => user.username === username && user.password === password);
  if(!user){
  return NextResponse.json(
     {
       ok: false,
       message: "Username or Password is incorrect",
     },
     { status: 400 }
   );

  }

  const token = jwt.sign(
    { username, role: user.role},
    process.env.JWT_SECRET as string,
    { expiresIn: "8h" }
  );

  return NextResponse.json({ ok: true, token });
};
