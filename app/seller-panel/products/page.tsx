"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/authContext";
import { getSellerProducts } from "@/app/lib/api/getSellerProducts";

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const token = user?.token;

  const { data, isLoading, error } = useQuery({
    queryKey: ["products",user?.id],
    queryFn: () => getSellerProducts(token!),
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
