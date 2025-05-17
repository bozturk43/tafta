import { NextRequest, NextResponse } from 'next/server';
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "@/app/lib/firebase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID parametresi eksik' }, { status: 400 });
    }

    // Firestore'dan ürün verisini al
    const productRef = doc(db, 'products', id);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }

    const productData = productDoc.data();

const storageRef = ref(storage, `product_images/${id}`);
    const files = await listAll(storageRef);

    const imageUrls = await Promise.all(
      files.items.map(async (itemRef) => {
        return await getDownloadURL(itemRef);
      })
    );

    return NextResponse.json({
      ...productData,
      id: productDoc.id,
      images: imageUrls,
    });
  } catch (error) {
    console.error('Hata:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}