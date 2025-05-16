"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/authContext";

export default function SellerDashboardPage() {
  const { user } = useAuth();
  console.log(user)
  const fetchProducts = async () => {
    const res = await fetch('http://localhost:3000/api/seller/get-products', {
      headers: {
        Authorization: `Bearer ${user?.token ?? ""}`, // token'ı header'a ekle
      },
    });
    if (!res.ok) throw new Error("Ürünler alınamadı");
    const data = await res.json();
    return data.products;
  };

  const token = user?.token;

  const { data, isLoading, error } = useQuery({
    queryKey: ["products",user?.id],
    queryFn: () => fetchProducts(),
    enabled: !!token,
  });

  return (
    <div>
    <h1>Ürün Yönetimi</h1>
    {isLoading && <div>Yükleniyor...</div>}
    {error && <div>Hata: {(error as Error).message}</div>}
    {data && data.length === 0 ? <div> Henüz Ürün Eklemediniz.</div> :
      <ul>
      {data?.map((product: any) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
    }
  </div>
  );
}
