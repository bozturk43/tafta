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

        if (payload.type !== "producer") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const producerId = payload.id as string;

        const q = query(
            collection(db, "customRequests"),
            where("producerId", "==", producerId)
        );
        const querySnapshot = await getDocs(q);

        const requests = await Promise.all(
            querySnapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();
                const createdAt = data.createdAt?.toDate
                    ? data.createdAt.toDate().toISOString()
                    : data.createdAt || null;

                const customerId = data.customerId;
                let customer: any = null;
                let avatar: string | null = null;

                // Firestore'dan customer bilgisi al
                try {
                    const customerDoc = await getDoc(doc(db, "customers", customerId));
                    if (customerDoc.exists()) {
                        customer = customerDoc.data();
                        try {
                            const folderRef = ref(storage, "customer_profile_images");
                            const listResult = await listAll(folderRef);

                            const matchingFile = listResult.items.find((item) =>
                                item.name.startsWith(customerId)
                            );

                            if (matchingFile) {
                                avatar = await getDownloadURL(matchingFile);
                            }
                        } catch (err) {
                            console.warn(`Avatar alınırken hata oluştu: ${err}`);
                        }

                    }
                } catch (e) {
                    console.warn(`Customer verisi veya avatarı alınamadı: ${customerId}`, e);
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
                        adress: customer.adress,
                        email: customer.email,
                        name: customer.name,
                        phone: customer.phone,
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
