import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const producerId = searchParams.get('producerId');

  if (!producerId) {
    return NextResponse.json({ error: 'producerId gerekli' }, { status: 400 });
  }

  try {
    const snapshot = await getDocs(collection(db, 'orders'));

    const filteredOrders: any[] = [];

    snapshot.forEach((doc) => {
      const order = doc.data();
      const matchedItems = order.items.filter(
        (item: any) => item.producerId === producerId
      );

      if (matchedItems.length > 0) {
        filteredOrders.push({
          orderId: order.orderId,
          createdAt: order.createdAt,
          customer: order.customer,
          items: matchedItems,
        });
      }
    });

    return NextResponse.json(filteredOrders);
  } catch (err) {
    console.error('Producer orders fetch error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
