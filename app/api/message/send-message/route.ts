// app/api/conversations/route.ts
import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { senderId, receiverId, messageContent } = await req.json();

    if (!senderId || !receiverId || !messageContent) {
      return NextResponse.json(
        { error: "Gönderici ID, alıcı ID ve mesaj içeriği gereklidir" },
        { status: 400 }
      );
    }

    // Mevcut konuşmayı kontrol et
    const convRef = collection(db, "conversations");
    const q = query(
      convRef,
      where("participants", "in", [
        [senderId, receiverId],
        [receiverId, senderId]
      ])
    );

    const snapshot = await getDocs(q);
    let conversationId;

    // Konuşma zaten varsa
    if (!snapshot.empty) {
      conversationId = snapshot.docs[0].id;
      
      // Konuşma bilgilerini güncelle
      await updateDoc(doc(db, "conversations", conversationId), {
        lastMessage: messageContent,
        lastMessageTime: serverTimestamp(),
        lastMessageSenderId: senderId
      });
    } 
    // Yeni konuşma oluştur
    else {
      const newConversation = {
        participants: [senderId, receiverId],
        lastMessage: messageContent,
        lastMessageTime: serverTimestamp(),
        lastMessageSenderId: senderId,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(convRef, newConversation);
      conversationId = docRef.id;
    }

    // Mesajı alt koleksiyona ekle
    const messagesRef = collection(
      db, 
      `conversations/${conversationId}/messages`
    );
    
    await addDoc(messagesRef, {
      senderId,
      content: messageContent,
      timestamp: serverTimestamp()
    });

    return NextResponse.json({ 
      success: true,
      conversationId,
      isNewConversation: snapshot.empty
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Mesaj gönderilemedi" }, 
      { status: 500 }
    );
  }
}