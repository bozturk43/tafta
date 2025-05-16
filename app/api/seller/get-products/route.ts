import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";


// JWT secret key (env’den çekmelisin)
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header missing" }, { status: 401 });
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
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // role kontrolü
    if (payload.type !== "producer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Firestore'dan kendi ürünlerini çek
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("producerId", "==", payload.id));
    const querySnapshot = await getDocs(q);

    const products = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const date = data.createdAt
        ? new Date(data.createdAt.seconds * 1000 + data.createdAt.nanoseconds / 1_000_000)
        : null;

      const formattedDate = date
        ? `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}.${date.getFullYear()}`
        : null;

      return {
        id: doc.id,
        ...data,
        createdAt: formattedDate,
      };
    });

    return NextResponse.json({ products });

  } catch (error) {
    console.error("Error in products API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
