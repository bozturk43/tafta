import { NextRequest, NextResponse } from "next/server";
import { doc,collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db, storage } from "@/app/lib/firebase";
import { jwtVerify } from "jose";
import { ref, getDownloadURL, listAll } from "firebase/storage";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "Yetki gerekli" }, { status: 401 });
        }

        const token = authHeader.replace("Bearer ", "");
        let payload;

        try {
            const { payload: jwtPayload } = await jwtVerify(
                token,
                new TextEncoder().encode(JWT_SECRET)
            );
            payload = jwtPayload;
        } catch (err) {
            return NextResponse.json({ error: "Geçersiz token",err }, { status: 401 });
        }

        const currentUserId = payload.id as string;
        const currentUserType = payload.type as "producer" | "customer";

        const q = query(
            collection(db, "conversations"),
            where("participants", "array-contains", currentUserId)
        );

        const querySnapshot = await getDocs(q);

        const conversations = await Promise.all(
            querySnapshot.docs.map(async (docu) => {
                const data = docu.data();
                const otherId = data.participants.find((id: string) => id !== currentUserId);

                let otherName = "Bilinmiyor";
                let otherAvatar: string | null = null;

                if (otherId) {
                    // hangi koleksiyona bakılacağını belirle
                    const isOtherCustomer = currentUserType === "producer";
                    const otherDocRef = doc(db, isOtherCustomer ? "customers" : "producers", otherId);
                    const otherSnap = await getDoc(otherDocRef);

                    if (otherSnap.exists()) {
                        const otherDoc = otherSnap.data();
                        otherName = otherDoc.name || otherDoc.fullName || "İsimsiz";
                    }

                    // avatar al
                    const folderName = isOtherCustomer
                        ? "customer_profile_images"
                        : "producer_profile_images";

                    try {
                        const avatarRef = ref(storage, `${folderName}`);
                        const listResult = await listAll(avatarRef);
                         const matchingFile = listResult.items.find((item) =>
                                item.name.startsWith(otherSnap.id)
                            );

                        if (matchingFile) {
                                otherAvatar = await getDownloadURL(matchingFile);
                            }
                    } catch (err) {
                        console.warn(`Profil resmi yüklenemedi: ${folderName}/${otherId}`,err);
                    }
                }

                return {
                    id: docu.id,
                    ...data,
                    updatedAt: data.lastMessageTime?.toDate
                        ? data.lastMessageTime.toDate().toISOString()
                        : null,
                    other: {
                        id: otherId,
                        name: otherName,
                        avatar: otherAvatar,
                    },
                };
            })
        );

        return NextResponse.json({ conversations });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}
