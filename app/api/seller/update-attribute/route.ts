import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

interface JWTPayload {
  id: string;
  type: string;
  [key: string]: unknown;
}

interface AttributeUpdateData {
  name: string;
  options: Array<{
    value: string;
    extraPrice: number;
  }>;
}

export async function PUT(req: NextRequest) {
  try {
    // 1. Yetkilendirme Kontrolü
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Yetki gerekli" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    const jwtPayload = payload as JWTPayload;

    if (jwtPayload.type !== "producer") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    // 2. Parametreleri ve Body'yi Alma
    const { searchParams } = new URL(req.url);
    const attributeId = searchParams.get('id');
    const { name, options } = await req.json() as AttributeUpdateData;
    const producerId = jwtPayload.id;

    // 3. Validasyon
    if (!attributeId) {
      return NextResponse.json(
        { error: "Attribute ID gereklidir" },
        { status: 400 }
      );
    }

    if (!name || !options || !Array.isArray(options)) {
      return NextResponse.json(
        { error: "Geçersiz istek: name ve options array gereklidir" },
        { status: 400 }
      );
    }

    // 4. Firestore Güncelleme
    const producerRef = doc(db, "attributes", producerId);
    
    await updateDoc(producerRef, {
      [`${attributeId}`]: {
        name,
        options,
        updatedAt: serverTimestamp()
      }
    });

    return NextResponse.json({ 
      success: true,
      attributeId: attributeId,
      message: "Attribute başarıyla güncellendi"
    });

  } catch (error) {
    console.error("Attribute güncelleme hatası:", error);
    return NextResponse.json(
      { 
        error: "Sunucu hatası",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}