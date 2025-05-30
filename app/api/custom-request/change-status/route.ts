import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function PUT(
  req: NextRequest
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Yetki gerekli" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    let payload;

    try {
      const { payload: jwtPayload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      payload = jwtPayload;
    } catch (err) {
      return NextResponse.json({ error: "Geçersiz token", err }, { status: 401 });
    }

    if (payload.type !== "producer") {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const requestid = searchParams.get("requestid");

    if (!requestid) {
      return NextResponse.json({ error: "Request ID gerekli" }, { status: 400 });
    }
    
    const body = await req.json();
    const newStatus = body.status;

    if (!newStatus) {
      return NextResponse.json({ error: "Yeni durum belirtilmeli" }, { status: 400 });
    }

    const requestRef = doc(db, "customRequests", requestid);
    await updateDoc(requestRef, {
      status: newStatus,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Durum güncelleme hatası:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
