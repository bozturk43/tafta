export const getWorkshopsData = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const res = await fetch(`${baseUrl}/api/global/get-workshops-data`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Workshop Bilgileri alınamadı");

  const data = await res.json();
  return data;
};
