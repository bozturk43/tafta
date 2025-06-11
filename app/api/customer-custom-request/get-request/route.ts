import { NextResponse } from "next/server";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc
} from "firebase/firestore";
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

        if (payload.type !== "customer") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const customerId = payload.id as string;

        const q = query(
            collection(db, "customRequests"),
            where("customerId", "==", customerId)
        );
        const querySnapshot = await getDocs(q);

        const requests = await Promise.all(
            querySnapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();
                const createdAt = data.createdAt?.toDate
                    ? data.createdAt.toDate().toISOString()
                    : data.createdAt || null;

                const producerId = data.producerId;
                let producer: any = null;
                let avatar: string | null = null;

                // Firestore'dan customer bilgisi al
                try {
                    const producerDoc = await getDoc(doc(db, "producers", producerId));
                    if (producerDoc.exists()) {
                        producer = producerDoc.data();
                        try {
                            const folderRef = ref(storage, "producer_profile_images");
                            const listResult = await listAll(folderRef);

                            const matchingFile = listResult.items.find((item) =>
                                item.name.startsWith(producerId)
                            );

                            if (matchingFile) {
                                avatar = await getDownloadURL(matchingFile);
                            }
                        } catch (err) {
                            console.warn(`Avatar alınırken hata oluştu: ${err}`);
                        }

                    }
                } catch (e) {
                    console.warn(`Producer verisi veya avatarı alınamadı: ${customerId}`, e);
                }

                // custom_requests klasöründen görselleri al
                let imageUrls: string[] = [];
                try {
                    const imagesRef = ref(storage, `custom_requests/${docSnap.id}`);
                    const listResult = await listAll(imagesRef);
                    imageUrls = await Promise.all(
                        listResult.items.map((itemRef) => getDownloadURL(itemRef))
                    );
                } catch (err) {
                    console.warn(`Fotoğraflar alınamadı: ${docSnap.id}`, err);
                }

                return {
                    id: docSnap.id,
                    ...data,
                    createdAt,
                    images: imageUrls,
                    customer: {
                        email: producer.email,
                        name: producer.name,
                        avatar,
                    },
                };
            })
        );

        return NextResponse.json({ requests });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}
