"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "@/context/authContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAttributes } from "@/app/lib/api/getAttributes";
import DeleteIcon from '@mui/icons-material/Delete';
import { CircularProgress } from "@mui/material";

export default function ProductFormInner() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const [isEditing, setIsEditing] = useState(false);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [attributes, setAttributes] = useState<any>({});
    const [useVariations, setUseVariations] = useState(false);
    const [selectedAttributes, setSelectedAttributes] = useState<{ attributeId: string }[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // Ürün detaylarını yükle
    useEffect(() => {
        if (!user?.token) return;
        const loadProductData = async () => {
            if (productId) {
                setIsLoading(true);
                try {
                    const res = await fetch(`${baseUrl}/api/global/get-product-by-id?id=${productId}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });
                    const product = await res.json();

                    // Form alanlarını doldur
                    reset({
                        name: product.name,
                        basePrice: product.basePrice,
                        description: product.description,
                        averageTime: product.averageTime,
                    });

                    // Varyasyonları ayarla
                    if (product.attributes?.length > 0) {
                        setUseVariations(true);
                        setSelectedAttributes(product.attributes);
                    }

                    // Mevcut resimleri ayarla
                    setExistingImages(product.images || []);
                    setIsEditing(true);
                } catch (error) {
                    console.error("Ürün yüklenirken hata:", error);
                }
                finally {
                    setIsLoading(false); // Yükleme bitti
                }
            }
            // Nitelikleri yükle
            const attrs = await getAttributes(user.token);
            setAttributes(attrs || {});
        };

        loadProductData();
    }, [user, productId, reset]);

    const toggleVariation = (attributeId: string) => {
        setSelectedAttributes((prev) => {
            if (prev.some((item) => item.attributeId === attributeId)) {
                return prev.filter((item) => item.attributeId !== attributeId);
            }
            return [...prev, { attributeId }];
        });
    };

    const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const filesArray = Array.from(e.target.files);
        setSelectedFiles((prev) => [...prev, ...filesArray]);
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
    };

    const removeExistingImage = (index: number) => {
        const newImages = existingImages.filter((_, i) => i !== index);
        setExistingImages(newImages);
    };

    const handleDeleteImage = async (imageUrl: string) => {
        if (!user?.token) return;

        try {
            const res = await fetch('/api/seller/delete-product-image', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`, // Varsa
                },
                body: JSON.stringify({ imageUrl }),
            });

            const data = await res.json();
            if (res.ok) {
                console.log('Görsel silindi:', data.message);
                // Görseli state'ten de çıkar:
                setExistingImages(prev => prev.filter(img => img !== imageUrl));
            } else {
                console.error('Hata:', data.error);
            }
        } catch (error) {
            console.error('Silme hatası:', error);
        }
    };


    const onSubmit = async (data: any) => {
        if (!user?.token) return;
        try {
            // Ürün verilerini gönder
            const productData = {
                name: data.name,
                basePrice: parseFloat(data.basePrice),
                description: data.description,
                averageTime: data.averageTime,
                attributes: selectedAttributes,
            };
            let apiUrl = `${baseUrl}/api/seller/add-product`;
            let method = "POST";

            if (isEditing && productId) {
                apiUrl = `${baseUrl}/api/seller/update-product?id=${productId}`;
                method = "PUT";
            }
            const res = await fetch(apiUrl, {
                method,
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });
            const { productId: returnedProductId } = await res.json();
            const targetProductId = isEditing ? productId : returnedProductId;
            // Yeni görselleri gönder (eğer varsa)
            if (isEditing === false && selectedFiles.length > 0) {
                const formData = new FormData();
                selectedFiles.forEach((file: File, i: number) => {
                    formData.append("images", file, i === 0 && !isEditing ? "thumbnail.jpg" : file.name);
                });
                formData.append("productId", targetProductId!);

                await fetch(`${baseUrl}/api/seller/upload-product-images`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                    body: formData,
                });
            }
            if (isEditing && selectedFiles.length > 0) {
                const formData = new FormData();
                formData.append('productId', targetProductId);

                selectedFiles.forEach(file => {
                    formData.append('images', file);
                });


                await fetch(`${baseUrl}/api/seller/update-product-images`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        // ❌ Content-Type belirtme, fetch kendisi `multipart/form-data` olarak ayarlayacak
                    },
                    body: formData,
                });
            }
            router.push("/seller-panel/products");
        } catch (error) {
            console.error("Ürün kaydedilirken hata:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto p-6 flex justify-center items-center h-[70vh]">
                <div className="text-center">
                    <CircularProgress size={60} />
                    <p className="mt-4 text-lg">Ürün bilgileri yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">
                {isEditing ? "Ürünü Güncelle" : "Ürün Ekle"}
            </h1>

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
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${errors.basePrice ? "border-red-500 ring-red-300" : "border-gray-300"
                            }`}
                    />
                    {errors.basePrice && (
                        <p className="text-red-600 mt-1 text-sm">{errors.basePrice?.message && errors.basePrice.message.toString()}</p>
                    )}
                </div>

                {/* Ürün Adı */}
                <div>
                    <label className="block mb-1 font-medium" htmlFor="averageTime">
                        Ortalama Tamamlama Süresi <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="averageTime"
                        placeholder="Örn: 1 hafta "
                        type="text"
                        {...register("averageTime", { required: "Ortalama Süre Gerekl" })}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${errors.name ? "border-red-500 ring-red-300" : "border-gray-300"
                            }`}
                    />
                    {errors.name && (
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
                            <p className="text-gray-500">Henüz nitelik eklemediniz. Lütfen varyasyon eklemek için önce nitelikler ekranından en az bir tane nitelik ekleyin.</p>
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
                    >
                        Fotoğraf Ekle
                    </button>
                    {errors.images && (
                        <p className="text-red-600 mt-1 text-sm">
                            {errors.images?.message && errors.images.message.toString()}
                        </p>
                    )}

                    {/* Mevcut resimlerin önizlemeleri */}
                    {existingImages.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-medium mb-2">Mevcut Görseller</h3>
                            <div className="flex flex-wrap gap-4">
                                {existingImages.map((url, idx) => (
                                    <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden">
                                        <img
                                            src={url}
                                            alt={`existing-preview-${idx}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => { 
                                                removeExistingImage(idx); 
                                                handleDeleteImage(url) ;
                                            }}
                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                            aria-label="Remove image"
                                        >
                                            <DeleteIcon style={{ fontSize: 16 }} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Yeni eklenen resimlerin önizlemeleri */}
                    {selectedFiles.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-medium mb-2">Yeni Eklenen Görseller</h3>
                            <div className="flex flex-wrap gap-4">
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
                        </div>
                    )}
                </div>

                {/* Kaydet/Güncelle Butonu */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition"
                >
                    {isEditing ? "Güncelle" : "Kaydet"}
                </button>
            </form>
        </div>
    );
}