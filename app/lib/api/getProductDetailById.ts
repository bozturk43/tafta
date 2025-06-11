export const getProductDetailById = async (productId: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const res = await fetch(`${baseUrl}/api/global/get-product-detail-by-id?prdid=${productId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Ürün Bilgileri alınamadı");
  const data = await res.json();
  return data;
};
