export const getSellerInfo = async (token: string) => {
  const res = await fetch("http://localhost:3000/api/seller/get-seller-info", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Nitelikler alınamadı");

  const data = await res.json();
  console.log(data);
  return data;
};
