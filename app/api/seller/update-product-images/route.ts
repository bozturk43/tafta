import { NextResponse } from 'next/server';
import { storage } from '@/app/lib/firebase';
import { ref, listAll, deleteObject } from 'firebase/storage';

export async function POST(request: Request) {
  try {
    const { productId, images } = await request.json();
    
    if (!productId) {
      return NextResponse.json({ error: 'Ürün IDsi gerekli' }, { status: 400 });
    }

    // Storage'daki mevcut görselleri al
    const storageRef = ref(storage, `product_images/${productId}`);
    const existingFiles = await listAll(storageRef);

    // Kaldırılan görselleri sil
    const filesToKeep = images || [];
    const filesToDelete = existingFiles.items.filter(file => 
      !filesToKeep.some((imgUrl: string) => imgUrl.includes(file.name))
    );

    await Promise.all(filesToDelete.map(fileRef => deleteObject(fileRef)));

    return NextResponse.json({ 
      success: true, 
      message: 'Görseller başarıyla güncellendi'
    });
    
  } catch (error) {
    console.error('Görsel güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Görseller güncellenirken hata oluştu', details: error },
      { status: 500 }
    );
  }
}