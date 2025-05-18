import { NextRequest, NextResponse } from 'next/server';
import { db, storage } from '@/app/lib/firebase';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(req: NextRequest) {
    const producerId = req.nextUrl.searchParams.get('id');

    if (!producerId) {
        return NextResponse.json({ error: 'producerId parametresi gerekli' }, { status: 400 });
    }

    try {
        // 1. Producer bilgilerini al
        const producerDoc = await getDoc(doc(db, 'producers', producerId));
        if (!producerDoc.exists()) {
            return NextResponse.json({ error: 'Producer bulunamadı' }, { status: 404 });
        }

        const producerData = producerDoc.data();

        // 2. Producer avatar görselini storage'dan al
        let avatarUrl = '';

        const avatarRef = ref(storage, `producer_profile_images/${producerId}`);
        try {
            avatarUrl = await getDownloadURL(avatarRef);
        }
        catch (err) {
            console.error(err)
            // Dosya bulunamazsa devam et
        }

        const producer = {
            id: producerDoc.id,
            ...producerData,
            avatar: avatarUrl, // bulunamazsa boş string olacak
        };

        // 3. Producer'a ait ürünleri al
        const productsQuery = query(
            collection(db, 'products'),
            where('producerId', '==', producerId)
        );
        const productsSnapshot = await getDocs(productsQuery);

        const products = await Promise.all(
            productsSnapshot.docs.map(async (docSnap) => {
                const product = { id: docSnap.id, ...docSnap.data() };

                // 4. Storage'dan image linklerini al
                const imageRef = ref(storage, `product_images/${product.id}`);
                try {
                    const imageList = await listAll(imageRef);
                    const imageUrls = await Promise.all(
                        imageList.items.map((itemRef) => getDownloadURL(itemRef))
                    );
                    return { ...product, images: imageUrls };
                } catch (err) {
                    console.error(`Image load error for product ${product.id}`, err);
                    return { ...product, images: [] };
                }
            })
        );

        // 5. JSON response
        return NextResponse.json({ producer, products });

    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
