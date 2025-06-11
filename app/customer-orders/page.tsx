"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/authContext";
import { useMemo } from "react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Chip } from "@mui/material";
import { Table } from "@/components/Table";
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
    producerName:string;
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

    const token = user?.token;

    const customerId = user?.id; // veya başka bir producerId

    const { data: orderData, isLoading: ordersLoading, error: orderError } = useQuery({
        queryKey: ["customerOrders", customerId],
        queryFn: async () => {
            const res = await fetch(`/api/get-customer-order?customerId=${customerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                console.error(orderError);
                throw new Error("Producer orders fetch failed");
            }

            return res.json();
        },
        enabled: !!customerId,
    });


    const columns = useMemo<ColumnDef<OrderObject>[]>(() => [
        {
            accessorKey: "orderId",
            header: "Sipariş No",
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
    if (orderError) return <div>Hata: {(orderError as Error).message}</div>;
    if (!orderData || orderData.length === 0) return <div>Henüz sipariş yok.</div>;

    return (
        <div className="p-4">
            <Table data={orderData} columns={columns}
                renderSubComponent={(row) => (
                    <SubRowComponent row={row} />
                )}
            />
        </div>
    );
}

function SubRowComponent({ row }: { row: Row<OrderObject> }) {

    return (
        <div className="space-y-2">
            <h4 className="font-semibold mb-2">Ürünler:</h4>
            <table className="w-full border border-gray-200 text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Görsel</th>
                        <th className="p-2 border">Satıcı</th>
                        <th className="p-2 border">Ürün Adı</th>
                        <th className="p-2 border">Adet</th>
                        <th className="p-2 border">Tutar</th>
                        <th className="p-2 border">Seçilen Nitelikler</th>
                        <th className="p-2 border">Sipariş Durumu</th>
                    </tr>
                </thead>
                <tbody>
                    {row.original.items.map((item, i) => (
                        <tr key={i} className="even:bg-white odd:bg-gray-50">
                            <td className="border p-2">
                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover" />
                            </td>
                            <td className="border p-2">{item.producerName}</td>
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
                            <td className="border p-2">{item.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
