export const getProducerProducts = async (producerId: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const res = await fetch(`${baseUrl}/api/seller/get-producer-products?id=${producerId}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Profil Bilgisi alınamadı");
  const data = await res.json();
  return data;
};
