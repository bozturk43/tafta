// app/lib/api/getSellerProducts.ts

export const getSellerProducts = async (token: string) => {
  const res = await fetch("http://localhost:3000/api/seller/get-products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Ürünler alınamadı");

  const data = await res.json();
  return data.products;
};
