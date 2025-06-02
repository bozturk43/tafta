import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { jwtVerify } from "jose";
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

interface JWTPayload {
  id: string;
  type: string;
  [key: string]: unknown;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Yetkilendirme Kontrolü
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Yetki gerekli" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const jwtPayload = payload as JWTPayload;

    if (jwtPayload.type !== "producer") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    // 2. Request Body Validasyonu
    const { name, options } = await req.json();
    if (!name || !options || !Array.isArray(options)) {
      return NextResponse.json(
        { error: "Geçersiz istek: name ve options array gereklidir" },
        { status: 400 }
      );
    }

    const producerId = jwtPayload.id;
    const attributeId = uuidv4();
    const attributeData = {
      name,
      options,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const producerRef = doc(db, "attributes", producerId);
    const producerSnap = await getDoc(producerRef);

    if (producerSnap.exists()) {
      // Belge varsa sadece yeni attribute'u ekle
      await updateDoc(producerRef, {
        [attributeId]: attributeData
      });
    } else {
      // Belge yoksa yeni belge oluştur
      await setDoc(producerRef, {
        [attributeId]: attributeData
      });
    }

    return NextResponse.json({
      success: true,
      attributeId,
      producerId,
      message: "Attribute başarıyla eklendi"
    });

  } catch (error) {
    console.error("Attribute eklenirken hata:", error);
    return NextResponse.json(
      {
        error: "Sunucu hatası",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
