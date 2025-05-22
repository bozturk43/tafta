// app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ success: true });

  // Token ve user cookie'lerini temizle
  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("user", "", {
    httpOnly: false, // Client erişebildiği için yine aynı ayar
    path: "/",
    maxAge: 0,
  });

  return response;
}
