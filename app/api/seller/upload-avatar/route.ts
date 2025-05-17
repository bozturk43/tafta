// app/api/seller/upload-avatar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/app/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req: NextRequest) {
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

    // 2. Form verisini al
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Dosya uzantısını kontrol et
    const fileExt = file.name.split('.').pop();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

    if (!fileExt || !allowedExtensions.includes(fileExt.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, JPEG, PNG, WEBP are allowed" },
        { status: 400 }
      );
    }

    // 4. Storage'a yükle
    const storageRef = ref(storage, `producer_profile_images/${producerId}`);
    const snapshot = await uploadBytes(storageRef, file);

    // 5. Download URL'sini al
    const downloadURL = await getDownloadURL(snapshot.ref);

    return NextResponse.json({
      success: true,
      url: downloadURL
    });

  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}