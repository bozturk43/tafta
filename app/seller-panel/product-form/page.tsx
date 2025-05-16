"use client";

import {
    Box,
    Button,
    Container,
    MenuItem,
    TextField,
    Typography,
    Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAttributes } from "@/app/lib/api/getAttributes";
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProductFormPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [attributes, setAttributes] = useState<any>({});
    const [useVariations, setUseVariations] = useState(false); // varyasyon aktif mi?
    const [selectedAttributes, setSelectedAttributes] = useState<{ attributeId: string }[]>([]);

    // toggle fonksiyonu:
    const toggleVariation = (attributeId: string) => {
        setSelectedAttributes((prev) => {
            // Eğer attributeId zaten varsa çıkaralım
            if (prev.some((item) => item.attributeId === attributeId)) {
                return prev.filter((item) => item.attributeId !== attributeId);
            }
            // Yoksa ekleyelim
            return [...prev, { attributeId }];
        });
    };

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const filesArray = Array.from(e.target.files);
        setSelectedFiles((prev) => [...prev, ...filesArray]);
        setValue("images", [...selectedFiles, ...filesArray]);
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        setValue("images", newFiles);
    };


    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    const watchImages = watch("images");

    useEffect(() => {
        if (!user?.token) return;
        (async () => {
            const attrs = await getAttributes(user.token);
            setAttributes(attrs || {});
        })();
    }, [user]);

    const onSubmit = async (data: any) => {
        if (!user?.token) return;

        const res = await fetch("http://localhost:3000/api/seller/add-product", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
                basePrice: parseFloat(data.basePrice),
                description: data.description,
                attributes: selectedAttributes,
            }),
        });

        const { productId } = await res.json();

        // Görselleri gönder
        const formData = new FormData();
        Array.from(data.images as File[]).forEach((file: File, i: number) => {
            formData.append("images", file, i === 0 ? "thumbnail.jpg" : file.name);
        });
        formData.append("productId", productId);
        await fetch(`http://localhost:3000/api/seller/upload-product-images`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
            body: formData,
        });

        router.push("/seller-panel/products");
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">Ürün Ekle</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Ürün Adı */}
                <div>
                    <label className="block mb-1 font-medium" htmlFor="name">
                        Ürün Adı <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="name"
                        type="text"
                        {...register("name", { required: "Ürün adı gerekli" })}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${errors.name ? "border-red-500 ring-red-300" : "border-gray-300"
                            }`}
                    />
                    {errors.name && (
                        <p className="text-red-600 mt-1 text-sm">{errors.name?.message && errors.name.message.toString()}</p>
                    )}
                </div>

                {/* Fiyat */}
                <div>
                    <label className="block mb-1 font-medium" htmlFor="price">
                        Fiyat (₺) <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="basePrice"
                        type="number"
                        step="0.01"
                        {...register("basePrice", { required: "Fiyat gerekli" })}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${errors.price ? "border-red-500 ring-red-300" : "border-gray-300"
                            }`}
                    />
                    {errors.price && (
                        <p className="text-red-600 mt-1 text-sm">{errors.name?.message && errors.name.message.toString()}</p>
                    )}
                </div>

                {/* Açıklama */}
                <div>
                    <label className="block mb-1 font-medium" htmlFor="description">
                        Açıklama
                    </label>
                    <textarea
                        id="description"
                        rows={4}
                        {...register("description")}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                    />
                </div>
                {/* Varyasyon checkbox */}
                <div className="mb-4">
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={useVariations}
                            onChange={() => setUseVariations((v) => !v)}
                            className="mr-2"
                        />
                        Varyasyon eklemek istiyorum
                    </label>
                </div>

                {/* Attributes */}
                {useVariations && (
                    <div className="mb-6 border rounded p-4 bg-gray-50">
                        <h2 className="font-semibold mb-4">Varyasyonlar (Ürüne eklemek istediğiniz varyasyonları seçin)</h2>

                        {Object.entries(attributes).length === 0 && (
                            <p className="text-gray-500">Henüz nitelik eklemediniz.Lütfen varyasyon eklemek için önce nitelikler ekranından en az birtane nitelik ekleyin.</p>
                        )}

                        {Object.entries(attributes).map(([key, attr]: any) => (
                            <div key={key} className="mb-4">
                                <label className="inline-flex items-center cursor-pointer mb-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedAttributes.some((item) => item.attributeId === key)}
                                        onChange={() => toggleVariation(key)}
                                        className="mr-2"
                                    />
                                    {attr.name}
                                </label>

                                {/* Varyasyon seçildiyse, altına seçenekleri göster */}
                                {selectedAttributes.some(item => item.attributeId === key) && (
                                    <ul className="ml-6 list-disc list-inside text-sm text-gray-700">
                                        {attr.options.map((opt: any, idx: number) => (
                                            <li key={idx}>
                                                {opt.value} {opt.extraPrice > 0 && `( +${opt.extraPrice} ₺ )`}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Görseller */}
                <div>
                    <label className="block mb-1 font-medium" htmlFor="images">
                        Ürün Görselleri <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={onFilesChange}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => document.getElementById('images')?.click()}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >Fotograf Ekle</button>
                    {errors.images && (
                        <p className="text-red-600 mt-1 text-sm">
                            {errors.images?.message && errors.images.message.toString()}
                        </p>
                    )}

                    {/* Önizlemeler */}
                    {selectedFiles.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-4">
                            {selectedFiles.map((file, idx) => (
                                <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`preview-${idx}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(idx)}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                        aria-label="Remove image"
                                    >
                                        <DeleteIcon style={{ fontSize: 16 }} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Kaydet Butonu */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition"
                >
                    Kaydet
                </button>
            </form>
        </div>
    );
}
