import { NextResponse } from 'next/server';
import { storage } from '@/app/lib/firebase';
import { ref, uploadBytes } from 'firebase/storage';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const productId = formData.get('productId') as string;
    const files = formData.getAll('images') as File[];

    if (!productId) {
      return NextResponse.json({ error: 'Ürün ID’si gerekli' }, { status: 400 });
    }

    // Sadece yükleme işlemi, silme yok
    await Promise.all(
      files.map(async file => {
        const fileRef = ref(storage, `product_images/${productId}/${file.name}`);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        await uploadBytes(fileRef, buffer, {
          contentType: file.type,
        });
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Görseller başarıyla yüklendi (silme yapılmadı)',
    });

  } catch (error) {
    console.error('Görsel yükleme hatası:', error);
    return NextResponse.json(
      { error: 'Görseller yüklenirken hata oluştu', details: `${error}` },
      { status: 500 }
    );
  }
}
