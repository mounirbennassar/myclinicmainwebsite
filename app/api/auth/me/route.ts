import { NextResponse } from "next/server";
import { queryOne } from "@/app/lib/db";

export async function GET(request: Request) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await queryOne(
    "select id, email, name, role, allowed_cities, is_active, can_export from team_members where id = $1",
    [userId]
  );

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
