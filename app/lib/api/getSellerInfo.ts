export const getSellerInfo = async (token: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const res = await fetch(`${baseUrl}/api/seller/get-seller-info`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Nitelikler alınamadı");

  const data = await res.json();
  return data;
};
