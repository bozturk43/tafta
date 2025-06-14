// app/lib/api/getSellerProducts.ts

export const getSellerProducts = async (token: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const res = await fetch(`${baseUrl}/api/seller/get-products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Ürünler alınamadı");

  const data = await res.json();
  return data.products;
};
