import { NextRequest, NextResponse } from 'next/server';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';
import { db, storage } from "@/app/lib/firebase";
import { getAttributesWoToken } from '@/app/lib/api/getAttributeWoToken';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('prdid');


  if (!productId) {
    return NextResponse.json({ error: 'productId (prdid) parametresi gerekli' }, { status: 400 });
  }

  try {
    // 1. Ürün bilgisi
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }

    const productData = productSnap.data();

    // 2. Ürün görselleri
    const imagesRef = ref(storage, `product_images/${productId}`);
    let productImages: string[] = [];

    try {
      const imagesList = await listAll(imagesRef);
      productImages = await Promise.all(
        imagesList.items.map((itemRef) => getDownloadURL(itemRef))
      );
    } catch {
      productImages = [];
    }

    // 3. Üretici bilgisi
    const producerId = productData.producerId;
    const producerRef = doc(db, 'producers', producerId);
    const producerSnap = await getDoc(producerRef);

    if (!producerSnap.exists()) {
      return NextResponse.json({ error: 'Üretici bulunamadı' }, { status: 404 });
    }

    const producerData = producerSnap.data();

    // 4. Üretici profil resmi
    let producerImage: string | null = null;
    try {
      const profileRef = ref(storage, `producer_profile_images/${producerId}`);
        producerImage = await getDownloadURL(profileRef);
    } catch {
      producerImage = null;
    }

    const attributes = await getAttributesWoToken(producerId);

    // 5. Cevap
    return NextResponse.json({
      product: {
        id: productId,
        ...productData,
        images: productImages,
      },
      producer: {
        id: producerId,
        name:producerData.name,
        title:producerData.title,
        image: producerImage,
      },
      attributes
    });
  } catch (error) {
    console.error('Hata:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
