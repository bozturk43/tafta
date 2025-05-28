export const getProductDetailById = async (productId: string) => {
  const res = await fetch(`https://tafta-pied.vercel.app/api/global/get-product-detail-by-id?prdid=${productId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Ürün Bilgileri alınamadı");
  const data = await res.json();
  return data;
};
