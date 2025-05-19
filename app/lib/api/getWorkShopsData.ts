export const getWorkshopsData = async () => {
  const res = await fetch("http://localhost:3000/api/global/get-workshops-data", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Workshop Bilgileri alınamadı");

  const data = await res.json();
  return data;
};
