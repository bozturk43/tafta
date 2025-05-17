export async function uploadSellerAvatar(file: File, token: string): Promise<{ url: string }> {
  // 1. Dosya validasyonu
  if (!file) {
    throw new Error('No file provided');
  }

  // 2. Dosya tipi kontrolü
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG and WEBP are allowed');
  }

  // 3. Dosya boyutu kontrolü (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum 5MB allowed');
  }

  try {
    // 4. FormData oluştur
    const formData = new FormData();
    formData.append('file', file);

    // 5. API'ye istek at
    const response = await fetch('/api/seller/upload-avatar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    // 6. Hata kontrolü
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Avatar upload failed');
    }

    // 7. Başarılı yanıtı dön
    return response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to upload avatar');
  }
}