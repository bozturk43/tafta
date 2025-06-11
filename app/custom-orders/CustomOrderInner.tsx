"use client";

import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogContent, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Table } from "@/components/Table";
import { UserType } from "@/context/authContext";
import Image from "next/image";
import MessageDialog from "@/components/MessageDialog";

type CustomRequestCustomer = {
    avatar: string;
    email: string;
    name: string;
    phone: string;
}

type CustomRequest = {
    id: string;
    customer: CustomRequestCustomer;
    description: string;
    status: "pending" | "accepted" | "rejected" | "completed";
    createdAt: string;
    images: string[];
};


const statusOptions = ["pending", "accepted", "rejected", "completed"] as const;

export default function CustomOrderInner({user}:{user:UserType}) {
    const [data, setData] = useState<CustomRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);
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
        const res = await fetch(`/api/custom-request/change-status?requestid=${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,

            },
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
            header: "Sipariş Oluşturan",
            accessorKey: "customer",
            cell: ({ row }: any) => (
                <div className="flex flex-row items-center gap-4">
                    <Image
                        width={40} height={40}
                        alt={"customer_image"}
                        src={row.original.customer.avatar}
                        className="rounded-full"
                    />
                    <div className="flex flex-col">
                        <Typography variant="body2" fontWeight={900}>
                            {row.original.customer.name}
                        </Typography>
                        <p className="text-[12px]">
                            {row.original.customer.email}
                        </p>
                        <p className="text-[12px]">
                            {row.original.customer.phone}
                        </p>
                    </div>

                </div>
            ),
        },
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
                    onChange={(e) => handleStatusChange(row.original.id, e.target.value as CustomRequest["status"])}>
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
            header: "Oluşturma Tarihi",
            accessorKey: "createdAt",
            cell: ({ row }: any) => (
                <p className="text-[12px]">
                    {new Date(row.original.createdAt).toLocaleString()}
                </p>
            )
        },
        {
            header: "Aksiyonlar",
            cell: ({ row }) => (
                <ActionCell row={row} />
            )
        }
    ];

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div className="p-12">
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
        </div>
    );
}

const ActionCell = ({ row }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex items-center justify-center">
            <Button sx={{fontSize:"10px"}} variant="contained" onClick={() => setIsOpen(true)}>Mesaj Gönder</Button>
            <MessageDialog
                open={isOpen}
                recieverImage={row.original.customer.avatar}
                recieverName={row.original.customer.name}
                onClose={() => setIsOpen(false)}
                receiverId={row.original.customerId}
            />
        </div>
    );
};

