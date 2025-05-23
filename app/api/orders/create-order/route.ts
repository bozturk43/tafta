import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

// 5 haneli random sayı üretir
function generateOrderId(): number {
  return Math.floor(10000 + Math.random() * 90000);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.phone || !data.items || data.items.length === 0) {
      return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
    }

    const orderId = generateOrderId();
    const createdAt = new Date().toISOString();

    // Her item'a status ekle
    const itemsWithStatus = data.items.map((item: any) => ({
      ...item,
      status: 'Sipariş oluşturuldu',
    }));

    const fullOrder = {
      orderId,
      createdAt,
      customer: {
        customerId: data.customerId ?? null,
        name: data.name,
        phone: data.phone,
        address: data.address,
      },
      items: itemsWithStatus,
    };

    // Sadece orders koleksiyonuna kayıt atılır
    await addDoc(collection(db, 'orders'), fullOrder);

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    console.error('Order POST error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
