import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecretkey");

export async function POST(req: NextRequest) {
  try {
    const { email, password, type } = await req.json();

    if (!email || !password || !type) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    const collectionName = type === "producer" ? "producers" : "customers";
    const colRef = collection(db, collectionName);
    const q = query(colRef, where("email", "==", email), where("password", "==", password));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "Giriş başarısız" }, { status: 401 });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // JWT payload oluştur
    const token = await new SignJWT({
      id: userDoc.id,
      email: userData.email,
      type,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(JWT_SECRET);

    // Cookie ayarları
    const cookieOptions = {
      httpOnly: true,
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 2, // 2 saat
      path: "/",
    };

    const response = NextResponse.json({
      success: true,
      token,
      user: { id: userDoc.id, name:userData.name,phone:userData.phone,adress:userData.address || "", email: userData.email, type },
    });

    response.cookies.set("token", token, cookieOptions)

    response.cookies.set("user", JSON.stringify({
      id: userDoc.id,
      email: userData.email,
      type,
    }), {
      ...cookieOptions,
      httpOnly: false // Client-side'da okunabilir olması için
    });

    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
