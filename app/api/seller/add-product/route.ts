// /api/seller/add-product/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req: NextRequest) {
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

    if (payload.type !== "producer") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const body = await req.json();
    const productData = {
      ...body,
      producerId: payload.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "products"), productData);
    return NextResponse.json({ productId: docRef.id });
  } catch (error) {
    console.error("Ürün eklenirken hata:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
