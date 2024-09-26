import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Suphaloek Khueanphet",
    studentId: "660610799",
  });
};
