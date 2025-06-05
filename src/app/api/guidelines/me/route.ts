import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Dummy function to simulate token verification (replace with real FastAPI call)
async function verifyToken(token: string) {
  // You can call FastAPI here using fetch if you want to delegate verification
  if (token === "valid") {
    return { userId: "123", email: "user@example.com" };
  }
  return null;
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("instack-token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
