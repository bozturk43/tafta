import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { jwtVerify } from "jose";
import { Attribute } from "@/app/lib/types";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET(req: NextRequest) {
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

    // 2. Parametreleri Alma
    const { searchParams } = new URL(req.url);
    const attributeKey = searchParams.get('id'); // Map içindeki dinamik key
    const producerId = payload.id;

    if (!attributeKey || !producerId) {
      return NextResponse.json(
        { error: "Attribute key gereklidir" },
        { status: 400 }
      );
    }

    // 3. Firestore'dan Tek Dokümanı Çekme
    const docRef = doc(db, "attributes", producerId.toString());
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: "Producer bulunamadı" },
        { status: 404 }
      );
    }

    const attributesData = docSnap.data();
    const attribute = attributesData[attributeKey] as Attribute;

    if (!attribute) {
      return NextResponse.json(
        { error: "Attribute bulunamadı" },
        { status: 404 }
      );
    }

    // 4. Response Formatı
    const responseData = {
      id: attributeKey,
      name: attribute.name,
      options: attribute.options,
      createdAt: attribute.createdAt,
      updatedAt: attribute.updatedAt
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error("Attribute getirme hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası", details: error },
      { status: 500 }
    );
  }
}