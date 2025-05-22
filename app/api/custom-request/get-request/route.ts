import { NextResponse } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import { jwtVerify } from "jose";
import { db, storage } from "@/app/lib/firebase";
import { getDownloadURL, listAll, ref } from "firebase/storage";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Yetki gerekli" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    let payload;

    try {
      const { payload: jwtPayload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      payload = jwtPayload;
    } catch (err) {
      return NextResponse.json({ error: `Invalid token ${err}` }, { status: 401 });
    }

    // role kontrolü
    if (payload.type !== "producer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const producerId = payload.id as string;

    const q = query(collection(db, "customRequests"), where("producerId", "==", producerId));
    const querySnapshot = await getDocs(q);

    // Burada tüm requestleri map'liyoruz ve fotoğrafları da yüklüyoruz
    const requests = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || null;

      // Storage'da requestId klasörünü oku
      const imagesRef = ref(storage, `custom_requests/${doc.id}`);
      let imageUrls: string[] = [];

      try {
        const listResult = await listAll(imagesRef);

        // Her dosyanın download url'sini al
        imageUrls = await Promise.all(
          listResult.items.map(async (itemRef) => {
            return await getDownloadURL(itemRef);
          })
        );
      } catch (storageErr) {
        console.warn(`Storage klasörü okunamadı: custom_requests/${doc.id}`, storageErr);
        // Hata durumunda imageUrls boş kalacak
      }

      return {
        id: doc.id,
        ...data,
        createdAt,
        images: imageUrls, // foto URL'leri buraya ekledik
      };
    }));

    return NextResponse.json({ requests });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

