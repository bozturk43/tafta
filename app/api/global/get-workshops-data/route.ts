import { NextResponse } from 'next/server';
import { db, storage } from '@/app/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { listAll, getDownloadURL, ref } from 'firebase/storage';
import { Producer } from '@/app/lib/types';


export async function GET() {
    try {
        const producersSnapshot = await getDocs(collection(db, 'producers'));
        const producers: Producer[] = [];

        for (const doc of producersSnapshot.docs) {
            const producerData: Producer = {
                id: doc.id,
                name: doc.data().name,
                title:doc.data().title,
                email:doc.data().email,
                createdAt:doc.data().createdAt,
                updatedAt:doc.data().updatedAt,
                description: doc.data().description,
                avatar: '',
                generalImages: []
            };

            // 1. Tek profil fotoğrafını al
            try {
                const profileImageRef = ref(storage, `producer_profile_images/${doc.id}`);
                producerData.avatar = await getDownloadURL(profileImageRef);
            } catch (error) {
                console.error(`Profil fotoğrafı alınırken hata (${doc.id}):`, error);
            }

            // 2. Ürünleri al
            const productsQuery = query(
                collection(db, 'products'),
                where('producerId', '==', doc.id)
            );
            const productsSnapshot = await getDocs(productsQuery);

            // 3. Her üründen 1 fotoğraf al
            for (const productDoc of productsSnapshot.docs) {
                try {
                    const productImagesRef = ref(storage, `product_images/${productDoc.id}`);
                    const imageList = await listAll(productImagesRef);
                    
                    if (imageList.items.length > 0) {
                        const firstImageUrl = await getDownloadURL(imageList.items[0]);
                        producerData.generalImages.push(firstImageUrl);
                    }
                } catch (error) {
                    console.error(`Ürün fotoğrafı alınırken hata (${productDoc.id}):`, error);
                }
            }

            producers.push(producerData);
        }

        return NextResponse.json({ producers });
    } catch (error) {
        console.error('Endpoint hatası:', error);
        return NextResponse.json(
            { error: 'Veriler alınırken bir hata oluştu' },
            { status: 500 }
        );
    }
}