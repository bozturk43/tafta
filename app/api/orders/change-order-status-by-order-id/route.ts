import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, productId, newStatus } = body;

    if (!orderId || !productId || !newStatus) {
      return NextResponse.json({ message: 'Eksik veri' }, { status: 400 });
    }

    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('orderId', '==', orderId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ message: 'Sipariş bulunamadı' }, { status: 404 });
    }

    // Genellikle 1 eşleşme olur, ama yine de ilkini alıyoruz
    const orderDoc = querySnapshot.docs[0];
    const orderData = orderDoc.data();

    const updatedItems = orderData.items.map((item: any) =>
      item.productId === productId ? { ...item, status: newStatus } : item
    );

    await updateDoc(orderDoc.ref, { items: updatedItems });

    return NextResponse.json({ message: 'Durum güncellendi' });
  } catch (error) {
    console.error('Durum güncelleme hatası:', error);
    return NextResponse.json({ message: 'Sunucu hatası' }, { status: 500 });
  }
}
