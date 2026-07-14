import { getCurrentUser, errorResponse, HttpError } from "@/app/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new HttpError(401, "Unauthorized");
    return Response.json({ user });
  } catch (err) {
    return errorResponse(err);
  }
}
