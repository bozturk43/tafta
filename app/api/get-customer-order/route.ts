import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');

    if (!customerId) {
        return NextResponse.json({ error: 'customerId gerekli' }, { status: 400 });
    }

    try {
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const filteredOrders: any[] = [];

        for (const docSnap of ordersSnapshot.docs) {
            const order = docSnap.data();

            if (order.customer?.customerId === customerId) {
                const enrichedItems = await Promise.all(
                    order.items.map(async (item: any) => {
                        const producerRef = doc(db, 'producers', item.producerId);
                        const producerSnap = await getDoc(producerRef);

                        return {
                            ...item,
                            producerName: producerSnap.exists() ? producerSnap.data().name : null,
                        };
                    })
                );

                filteredOrders.push({
                    orderId: order.orderId,
                    createdAt: order.createdAt,
                    customer: order.customer,
                    items: enrichedItems,
                });
            }
        }

        filteredOrders.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA; // büyükten küçüğe
        });

        return NextResponse.json(filteredOrders);
    } catch (err) {
        console.error('Customer orders fetch error:', err);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
