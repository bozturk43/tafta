import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name,email, password, type,title,description } = body;

    console.log(body);

    if (!email || !password || !type) {
      return NextResponse.json({ message: "Eksik alanlar var." }, { status: 400 });
    }
    const dbRef = type === "producer" ? "producers" : "customers";
    // Aynı email ile daha önce kayıt olmuş mu kontrolü
    const userRef = collection(db, dbRef);
    const q = query(userRef, where("email", "==", email));
    const existing = await getDocs(q);

    if (!existing.empty) {
      return NextResponse.json({ message: "Bu e-mail zaten kayıtlı." }, { status: 400 });
    }

    // Kayıt
    const newUser = {
      name,
      email,
      password, // Gerçek uygulamada şifreyi hash'le!
      type,     // "customer" veya "producer"
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(userRef, newUser);

    return NextResponse.json({
      message: "Kayıt başarılı.",
      user: {
        id: docRef.id,
        email,
        type
      }
    });
  } catch (error) {
    console.error("Kayıt hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası." }, { status: 500 });
  }
}
