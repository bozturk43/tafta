// app/lib/api/updateSellerInfo.ts
export async function updateSellerInfo(data:any, token: string) {
  const response = await fetch('/api/seller/update-seller-info', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update seller info');
  }

  return response.json();
}