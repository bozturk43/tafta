import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { NextRequest, NextResponse } from "next/server";
import { getDocs as getSubDocs, collection as subCollection } from "firebase/firestore";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user1 = searchParams.get("user1");
  const user2 = searchParams.get("user2");

  if (!user1 || !user2) {
    return NextResponse.json({ success: false, error: "Missing user IDs" }, { status: 400 });
  }

  try {
    const conversationsRef = collection(db, "conversations");

    const q = query(conversationsRef, where("participants", "array-contains-any", [user1, user2]));
    const snapshot = await getDocs(q);

    const matchingDoc = snapshot.docs.find(doc => {
      const participants = doc.data().participants;
      return participants.includes(user1) && participants.includes(user2);
    });

    if (!matchingDoc) {
      return NextResponse.json({ success: true, messages: [] });
    }

    const messagesRef = subCollection(db, "conversations", matchingDoc.id, "messages");
    const messagesSnap = await getSubDocs(messagesRef);
    const messages = messagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Mesajlar alınırken hata:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
