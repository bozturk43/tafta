export const getProducerProducts = async (producerId: string) => {
  const res = await fetch(`http://localhost:3000/api/seller/get-producer-products?id=${producerId}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Profil Bilgisi alınamadı");
  const data = await res.json();
  return data;
};
