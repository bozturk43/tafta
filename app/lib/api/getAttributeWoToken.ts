export const getAttributesWoToken = async (producerId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${baseUrl}/api/global/get-attribute-wo-token?producerId=${producerId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Nitelikler alınamadı");
  const data = await res.json();
  return data.attributes;
};
