// /api/seller/upload-product-images/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ref, uploadBytes } from "firebase/storage";
import { jwtVerify } from "jose";
import { v4 as uuidv4 } from "uuid";
import { storage } from "@/app/lib/firebase"; // Firebase yapılandırma

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

    const formData = await req.formData();
    const productId = formData.get("productId") as string;
    const files = formData.getAll("images") as File[];

    if (!productId || files.length === 0) {
      return NextResponse.json({ error: "Eksik veri" }, { status: 400 });
    }

    const uploadResults:string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = new Uint8Array(arrayBuffer);

      const fileName = i === 0 ? "thumbnail.jpg" : `${uuidv4()}.jpg`;
      const storageRef = ref(storage, `product_images/${productId}/${fileName}`);

      await uploadBytes(storageRef, fileBuffer, {
        contentType: file.type,
      });

      uploadResults.push(fileName);
    }

    return NextResponse.json({ success: true, uploaded: uploadResults });
  } catch (error) {
    console.error("Resim yüklenirken hata:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
