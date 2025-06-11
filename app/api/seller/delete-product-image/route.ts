import { NextResponse } from 'next/server';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '@/app/lib/firebase';

function getStoragePathFromUrl(url: string): string | null {
  try {
    const matches = url.match(/\/o\/(.*?)\?alt/);
    if (!matches || matches.length < 2) return null;
    return decodeURIComponent(matches[1]); // örn: product_images/abc123/photo.png
  } catch {
    return null;
  }
}

export async function DELETE(request: Request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl gerekli' }, { status: 400 });
    }

    const path = getStoragePathFromUrl(imageUrl);
    if (!path) {
      return NextResponse.json({ error: 'Geçersiz imageUrl' }, { status: 400 });
    }

    const fileRef = ref(storage, path);
    await deleteObject(fileRef);

    return NextResponse.json({ success: true, message: 'Görsel silindi' });
  } catch (error) {
    console.error('Silme hatası:', error);
    return NextResponse.json({ error: 'Görsel silinirken hata oluştu' }, { status: 500 });
  }
}
