import { NextResponse } from 'next/server';
import { db, storage } from '@/app/lib/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject, listAll } from 'firebase/storage';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Ürün IDsi gerekli' }, { status: 400 });
    }

    // Firestore'dan ürünü sil
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);

    // Storage'dan ürün görsellerini sil
    const storageRef = ref(storage, `product_images/${id}`);
    try {
      // Firebase Storage klasör silme işlemi (gerekiyorsa ekstra implementasyon)
      // Not: Firebase Storage direkt klasör silme desteklemez, dosya dosya silinmeli
      const listResult = await listAll(storageRef);
      await Promise.all(listResult.items.map(fileRef => deleteObject(fileRef)));
    } catch (storageError) {
      console.error('Görseller silinirken hata:', storageError);
    }

    return NextResponse.json({ success: true, message: 'Ürün başarıyla silindi' });
  } catch (error) {
    console.error('Silme hatası:', error);
    return NextResponse.json(
      { error: 'Ürün silinirken hata oluştu', details: error },
      { status: 500 }
    );
  }
}