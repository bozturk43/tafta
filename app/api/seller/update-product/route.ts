import { NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Ürün IDsi gerekli' }, { status: 400 });
    }

    const requestData = await request.json();
    
    // Firestore'da ürünü güncelle
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, {
      name: requestData.name,
      basePrice: requestData.basePrice,
      description: requestData.description,
      attributes: requestData.attributes || [],
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Ürün başarıyla güncellendi',
      productId: id
    });
    
  } catch (error) {
    console.error('Güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Ürün güncellenirken hata oluştu', details: error },
      { status: 500 }
    );
  }
}