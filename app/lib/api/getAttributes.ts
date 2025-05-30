export const getAttributes = async (token: string) => {
  const res = await fetch("https://tafta-pied.vercel.app//api/seller/get-attributes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Nitelikler alınamadı");

  const data = await res.json();
  return data.attributes;
};
