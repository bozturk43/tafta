// app/api/seller/update-seller-info/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function PUT(req: NextRequest) {
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
      return NextResponse.json({ error: "Producer Id Required" }, { status: 403 });
    }

    // 2. Request Body Validasyonu
    const { name, description } = await req.json();
    
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Invalid request: name is required and must be a string" },
        { status: 400 }
      );
    }

    // 3. Firestore'da güncelleme yap
    const producerRef = doc(db, "producers", producerId.toString());
    
    await updateDoc(producerRef, {
      name,
      ...(description && { description }), // Sadece description varsa ekle
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ 
      success: true,
      message: "Seller info updated successfully"
    });

  } catch (error) {
    console.error("Error updating seller info:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}