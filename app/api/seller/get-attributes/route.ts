import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { collection, getDocs } from "firebase/firestore";
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
      return NextResponse.json({ error: `Invalid token ${err}` }, { status: 401 });
    }
    // role kontrolü
    if (payload.type !== "producer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    // Firestore'dan kendi ürünlerini çek
    const attributesRef = collection(db, "attributes");
    const querySnapshot = await getDocs(attributesRef);
    const matchedDoc = querySnapshot.docs.find(doc => doc.id === payload.id);
    if (!matchedDoc) {
      return NextResponse.json({ attributes: [] });
    }
    const data = matchedDoc.data(); 
    return NextResponse.json({ attributes:data });

  } catch (error) {
    console.error("Error in attributes API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
