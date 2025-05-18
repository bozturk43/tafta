import { NextRequest, NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const producerId = searchParams.get('producerId');

    try {
        // Firestore'dan kendi ürünlerini çek
        const attributesRef = collection(db, "attributes");
        const querySnapshot = await getDocs(attributesRef);
        const matchedDoc = querySnapshot.docs.find(doc => doc.id === producerId);
        if (!matchedDoc) {
            return NextResponse.json({ attributes: [] });
        }
        const data = matchedDoc.data();
        return NextResponse.json({ attributes: data });

    } catch (error) {
        console.error("Error in attributes API:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
