"use client";

import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Dialog, DialogContent, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Table } from "@/components/Table";
import { UserType } from "@/context/authContext";
import Image from "next/image";

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



export default function CustomerCustomOrderInner({user}:{user:UserType}) {
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
                const res = await fetch("/api/customer-custom-request/get-request", {
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

    const columns = [
        {
            header: "Atölye",
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
                <div>{row.original.status}</div>
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

    if (loading) return <CircularProgress/>;

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
    console.log(isOpen,row);
    return (
        <div className="flex items-center justify-center">
            <Button sx={{fontSize:"10px"}} variant="contained" onClick={() => setIsOpen(true)}>İptal Et</Button>
        </div>
    );
};

