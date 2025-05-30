export const getAttributesWoToken = async (producerId: string) => {
  const res = await fetch(`https://tafta-pied.vercel.app/api/global/get-attribute-wo-token?producerId=${producerId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Nitelikler alınamadı");
  const data = await res.json();
  return data.attributes;
};
