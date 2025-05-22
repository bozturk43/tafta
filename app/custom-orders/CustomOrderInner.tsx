"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Table } from "@/components/Table";
import { useAuth } from "@/context/authContext";

type CustomRequest = {
    id: string;
    description: string;
    status: "pending" | "accepted" | "rejected" | "completed";
    createdAt: string;
    images: string[];
};

const statusOptions = ["pending", "accepted", "rejected", "completed"] as const;

export default function CustomOrderInner() {
    const [data, setData] = useState<CustomRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);
    const { user } = useAuth();
    const token = user?.token;


    useEffect(() => {
        async function fetchRequests() {
            setLoading(true);
            try {
                // Burada, JWT veya başka auth varsa onu header'a ekle
                const res = await fetch("/api/custom-request/get-request", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Veri alınamadı");

                const json = await res.json();
                console.log(json);
                setData(json.requests);
            } catch (error) {
                alert("İstekler yüklenirken hata oluştu");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchRequests();
    }, []);

    const handleStatusChange = async (id: string, newStatus: CustomRequest["status"]) => {
        const res = await fetch(`/api/custom-request/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });

        if (res.ok) {
            setData((prev) =>
                prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
            );
        } else {
            alert("Durum güncelleme başarısız.");
        }
    };

    const columns = [
        {
            header: "Açıklama",
            accessorKey: "description",
        },
        {
            header: "Durum",
            accessorKey: "status",
            cell: ({ row }: any) => (
                <select
                    value={row.original.status}
                    onChange={(e) => handleStatusChange(row.original.id, "completed")}
                >
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                    ))}
                </select>
            ),
        },
        {
            header: "Fotoğraflar",
            accessorKey: "images",
            cell: ({ row }: any) => (
                <div style={{ display: "flex", gap: 8 }}>
                    {row.original.images.map((img: string, idx: number) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Fotoğraf ${idx + 1}`}
                            style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                cursor: "pointer",
                                borderRadius: 4,
                            }}
                            onClick={() => {
                                setModalImage(img);
                                setModalOpen(true);
                            }}
                        />
                    ))}
                </div>
            ),
        },
        {
            header: "Oluşturulma Tarihi",
            accessorKey: "createdAt",
            cell: ({ row }: any) =>
                new Date(row.original.createdAt).toLocaleString(),
        },
    ];

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <>
            <Table columns={columns} data={data} />

            <Dialog
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogContent style={{ position: "relative", padding: 0 }}>
                    <IconButton
                        style={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: "white",
                            zIndex: 10,
                        }}
                        onClick={() => setModalOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                    {modalImage && (
                        <img
                            src={modalImage}
                            alt="Büyütülmüş fotoğraf"
                            style={{ width: "100%", height: "auto", display: "block" }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
