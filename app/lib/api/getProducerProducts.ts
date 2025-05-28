export const getProducerProducts = async (producerId: string) => {
  const res = await fetch(`https://tafta-pied.vercel.app//api/seller/get-producer-products?id=${producerId}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Profil Bilgisi alınamadı");
  const data = await res.json();
  return data;
};
