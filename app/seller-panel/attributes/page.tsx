"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/authContext";
import { getAttributes } from "@/app/lib/api/getAttributes";

export default function SellerAttributePage() {
  const { user } = useAuth();

  const token = user?.token;

  const { data, isLoading, error } = useQuery({
    queryKey: ["attributes",user?.id],
    queryFn: () => getAttributes(token!),
    enabled: !!token,
  });

  return (
    <div>
      <h1>Nitelik Yönetimi</h1>

      {isLoading && <div>Yükleniyor...</div>}
      {error && <div>Hata: {(error as Error).message}</div>}

      {!data || Object.keys(data).length === 0 ? (
        <div>Henüz nitelik eklemediniz.</div>
      ) : (
        <ul>
          {Object.entries(data).map(([attrKey, attrValue]: [string, any]) => (
            <li key={attrKey} className="mb-4">
              <strong>{attrValue.name}</strong>
              <ul className="ml-4 list-disc">
                {attrValue.options.map((option: any, index: number) => (
                  <li key={index}>
                    {option.value} {option.extraPrice > 0 && `( +${option.extraPrice} ₺ )`}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
