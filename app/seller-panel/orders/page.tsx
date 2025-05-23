"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/authContext";
import { getAttributes } from "@/app/lib/api/getAttributes";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Attribute } from "@/app/lib/types";
import { Button, Chip, IconButton, Stack } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from "next/navigation";
import { Table } from "@/components/Table";
import { transformAttributesToArray } from "@/app/lib/helpers/transformAttributesToArray";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import { useQueryClient } from '@tanstack/react-query';
export type OrderItem = {
    image: string;
    name: string;
    producerId: string;
    status: string;
    productId: string;
    basePrice: number;
    totalPrice: number;
    selectedAttributes: {
        selectedOptionExtraPrice: number;
        attributeId: string;
        selectedOptionValue: string;
    }[];
};

export type OrderObject = {
    orderId: number; // Sayı olarak geliyor, string değil
    createdAt: string;
    customer: {
        address: string;
        customerId: string;
        name: string;
        phone: string;
    };
    items: OrderItem[];
};

export default function ProducerOrder() {
    const { user } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();

    const token = user?.token;

    const { data, isLoading, error } = useQuery({
        queryKey: ["attributes", user?.id],
        queryFn: () => getAttributes(token!),
        enabled: !!token,
        select: (data) => transformAttributesToArray(data) // Veriyi otomatik dönüştür
    });

    const producerId = user?.id; // veya başka bir producerId

    const { data: orderData, isLoading: ordersLoading, error: orderError } = useQuery({
        queryKey: ["producerOrders", producerId],
        queryFn: async () => {
            const res = await fetch(`/api/orders/get-producer-orders?producerId=${producerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Producer orders fetch failed");
            }

            return res.json();
        },
        enabled: !!producerId,
    });


    const columns = useMemo<ColumnDef<OrderObject>[]>(() => [
        {
            accessorKey: "orderId",
            header: "Sipariş No",
        },
        {
            accessorKey: "customer.name",
            header: "Müşteri",
        },
        {
            accessorKey: "createdAt",
            header: "Tarih",
            cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
        },
        {
            id: "toplamUrun",
            header: "Ürün Adedi",
            cell: ({ row }) => row.original.items.length
        },
        {
            id: "toplamTutar",
            header: "Toplam Tutar (₺)",
            cell: ({ row }) =>
                row.original.items.reduce((acc, item) => acc + item.totalPrice, 0).toFixed(2)
        }
    ], []);

    if (ordersLoading) return <div>Yükleniyor...</div>;
    if (error) return <div>Hata: {(error as Error).message}</div>;
    if (!data || data.length === 0) return <div>Henüz sipariş yok.</div>;

    return (
        <div>
            <h1>Üretici Siparişleri</h1>
            <Table data={orderData} columns={columns}
                renderSubComponent={(row) => (
                    <div className="space-y-2">
                        <h4 className="font-semibold mb-2">Ürünler:</h4>
                        <table className="w-full border border-gray-200 text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border">Görsel</th>
                                    <th className="p-2 border">Ürün Adı</th>
                                    <th className="p-2 border">Adet</th>
                                    <th className="p-2 border">Tutar</th>
                                    <th className="p-2 border">Seçilen Nitelikler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {row.original.items.map((item, i) => (
                                    <tr key={i} className="even:bg-white odd:bg-gray-50">
                                        <td className="border p-2">
                                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover" />
                                        </td>
                                        <td className="border p-2">{item.name}</td>
                                        <td className="border p-2">1</td>
                                        <td className="border p-2">{item.totalPrice} ₺</td>
                                        <td className="border p-2">
                                            {item.selectedAttributes.map((attr, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={`${attr.selectedOptionValue} (+${attr.selectedOptionExtraPrice}₺)`}
                                                    size="small"
                                                    className="mr-1 mb-1"
                                                />
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            />
        </div>
    );
}
