import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth/getUserFromToken";

export async function GET(req) {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ message: "Access granted", user });
  } catch (err) {
    console.error("Error in /api/protected:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
