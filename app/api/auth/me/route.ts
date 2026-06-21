import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase";

export async function GET(request: Request) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getServiceSupabase();
  const { data: user, error } = await admin
    .from("team_members")
    .select("id, email, name, role, allowed_cities, is_active, can_export")
    .eq("id", userId)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
