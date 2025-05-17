// app/api/seller/get-seller-info/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, storage } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET(req: NextRequest) {
  try {
    // 1. Yetkilendirme Kontrolü
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Authorization required" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

    if (payload.type !== "producer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const producerId = payload.id;

    if (!producerId) {
      return NextResponse.json({ error: "Producer Id Not Resolved" }, { status: 401 });
    }
    // 2. Firestore'dan kullanıcı bilgilerini çek
    const producerRef = doc(db, "producers", producerId.toString());
    const producerDoc = await getDoc(producerRef);

    if (!producerDoc.exists()) {
      return NextResponse.json({ error: "Producer not found" }, { status: 404 });
    }

    // 3. Storage'dan avatar URL'sini al
    let avatarURL = "";
    try {
      const avatarRef = ref(storage, `producer_profile_images/${producerId}`);
      avatarURL = await getDownloadURL(avatarRef);
    } catch (error) {
      console.log(error,"Avatar image not found, using default");
    }

    // 4. Verileri birleştir ve dön
    const producerData = producerDoc.data();
    return NextResponse.json({
      ...producerData,
      avatarURL,
      createdAt: producerData.createdAt?.toDate().toISOString()
    });

  } catch (error) {
    console.error("Error fetching seller info:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}