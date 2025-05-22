// /app/api/custom-request/route.ts
import { NextResponse } from "next/server";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "@/app/lib/firebase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const customerId = formData.get("customerId") as string;
    const producerId = formData.get("producerId") as string;
    const description = formData.get("description") as string;
    const files = formData.getAll("files") as File[];

    if (!customerId || !producerId || !description || files.length === 0) {
      return NextResponse.json({ error: "Eksik alanlar var" }, { status: 400 });
    }

    // 1. Firestore dokümanını oluştur
    const docRef = await addDoc(collection(db, "customRequests"), {
      customerId,
      producerId,
      description,
      status: "pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const requestId = docRef.id;
    const uploadedFiles: string[] = [];

    // 2. Storage'a dosyaları yükle
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      // İsimlendirme: requestId altında klasör ve benzersiz isim
      const fileName = `${uuidv4()}.${file.name.split(".").pop() || "jpg"}`;
      const storageRef = ref(storage, `custom_requests/${requestId}/${fileName}`);

      await uploadBytes(storageRef, buffer, { contentType: file.type });
      uploadedFiles.push(fileName);
    }

    // Dilersen Firestore dokümanına yüklenen dosya isimlerini de ekleyebilirsin, ya da istemediğin için saklamazsın

    return NextResponse.json({ success: true, requestId, uploadedFiles });
  } catch (error) {
    console.error("Custom request upload error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
