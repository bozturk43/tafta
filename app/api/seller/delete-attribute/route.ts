// app/api/seller/delete-attribute/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { doc, updateDoc, deleteField } from "firebase/firestore"; // Düzeltilmiş import
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

interface JWTPayload {
  id: string;
  type: string;
  [key: string]: unknown;
}

export async function DELETE(req: NextRequest) {
  try {
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

    // Query Parametresinden ID'yi al
    const searchParams = new URL(req.url).searchParams;
    const attributeId = searchParams.get('id');
    if (!attributeId) {
      return NextResponse.json({ error: "Attribute ID gereklidir" }, { status: 400 });
    }

    const producerId = jwtPayload.id;

    // Firestore'da attribute'ü silme işlemi
    const producerRef = doc(db, "attributes", producerId);
    
    await updateDoc(producerRef, {
      [`${attributeId}`]: deleteField() // Düzeltilmiş kullanım
    });

    return NextResponse.json({ 
      success: true,
      message: "Attribute başarıyla silindi",
      deletedId: attributeId
    });

  } catch (error) {
    console.error("Attribute silinirken hata:", error);
    return NextResponse.json(
      { 
        error: "Sunucu hatası",
        message: error instanceof Error ? error.message : "Beklenmeyen hata",
        details: process.env.NODE_ENV === "development" ? error : undefined
      },
      { status: 500 }
    );
  }
}