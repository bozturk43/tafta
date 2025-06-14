"use client"
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { transformAttributesToArray } from "@/app/lib/helpers/transformAttributesToArray";
import { getAttributesWoToken } from "@/app/lib/api/getAttributeWoToken";
import { getProducerProducts } from "@/app/lib/api/getProducerProducts";
import { calculatePriceRange } from "@/app/lib/helpers/calculatePriceRange";
import { Attribute } from "@/app/lib/types";
import { Button, Divider } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { useState } from "react";
import MessageDialog from "@/components/MessageDialog";
import CustomRequestDialog from "@/components/CustomRequestDialog";

export default function ProducerPageInner({ producerId }: { producerId: string }) {

    const router = useRouter();
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [customReqOpen, setcustomReqOpen] = useState(false);


    const { data: attributesData, isLoading: attributesLoading, error: attributeError } = useQuery({
        queryKey: ["attributes"],
        queryFn: () => getAttributesWoToken(producerId!),
        enabled: !!producerId,
        staleTime: 0,
        select: (data) => transformAttributesToArray(data) // Veriyi otomatik dönüştür
    });

    const { data: pageData, isLoading: pageDataLoading, error: pageDataError } = useQuery({
        queryKey: ["pageData"],
        queryFn: () => getProducerProducts(producerId!),
        enabled: !!producerId,
        staleTime: 0
    });

    if (attributesLoading || pageDataLoading) {
        return (
            <h1>Sayfa Yükleniyor.</h1>
        )
    }
    if (attributeError || pageDataError) return <div>Hata: Veriler Alınırken bir sorun ile karşılaşıldı.</div>;


    return (
        <div className="min-h-screen bg-white">
            {/* Üst Başlık */}
            <div className="bg-blue-900 text-white py-6 text-center relative">
                <h1 className="text-[30px] font-bold">{pageData.producer.name}’ün Atölyesi</h1>
                <p className="text-[20px] mt-1">Üretmekten Mutluluk Duydukları</p>
            </div>

            <div className="flex flex-col lg:flex-row pe-4">
                {/* Sol Kısım: Üretici Bilgileri */}
                <div className="w-full h-full lg:w-1/4 h-screen bg-white rounded-xl shadow-lg p-6 relative z-10">
                    <div className="flex flex-col items-center">
                        <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg -mt-16 overflow-hidden">
                            <Image
                                src={pageData.producer.avatar}
                                alt="Üretici"
                                width={112}
                                height={112}
                                className="object-cover"
                            />
                        </div>
                        <h2 className="mt-4 text-xl font-semibold text-blue-800">{pageData.producer.name}</h2>
                        <p className="text-blue-500">{pageData.producer.title}</p>
                        <p className="text-gray-700 mt-4 text-sm whitespace-pre-line text-center">
                            {pageData.producer.description}
                        </p>

                        {/* Butonlar */}
                        <div className="mt-6 flex flex-col gap-4 w-full items-center pe-4">
                            <div className="flex flex-row bg-blue-50 h-[50px] rounded-full w-60 pe-4 mb-8">
                                <div className="w-1/4 ml-4" style={{marginTop:"-2px"}}>
                                    <Image src="/4.png" alt="" width={50} height={50} />
                                </div>
                                <Button className="w-3/4" sx={{ fontSize: "12px", color: "#161E50", lineHeight:"1.2" }}>
                                    Ürünün Kalbine Yolculuk İçin Tıkla.
                                </Button>
                            </div>
                            <div className="flex flex-row bg-[#97c11f] h-[50px] rounded-full w-60 pe-4">
                                <div className="w-1/4 ml-4">
                                    <Image src="/1.png" alt="" width={50} height={50} />
                                </div>
                                <Button className="w-3/4" sx={{ fontSize: "12px", color: "white",lineHeight:"1.2" }} disabled={!user} onClick={()=>setcustomReqOpen(true)}>
                                    Yeni Bir Fikrin mi Var? Özel Sipariş İste
                                </Button>
                            </div>
                            <div className="flex flex-row bg-[#F9F9F9] h-[50px] border-2 border-[#97c11f] rounded-full w-60 pe-4">
                                <div className="w-1/4 ml-4">
                                    <Image src="/2.png" alt="" width={50} height={50} />
                                </div>
                                <Button className="w-3/4" sx={{ fontSize: "12px", color: "#97c11f" }} disabled={!user} onClick={() => setOpen(true)}>
                                    Usta ile İletişime Geç
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sağ Kısım: Ürünler */}
                <div className="w-full lg:w-3/4 mt-8 lg:mt-4 lg:ml-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pageData.products.map((product, idx) => (
                            <div
                                key={idx}
                                className="bg-blue-50 rounded-xl shadow p-4 flex flex-col items-center cursor-pointer"
                                onClick={() => router.push(`/product/${product.id}`)}
                            >
                                <Image
                                    src={product.images.length > 0 ? product.images[0] : "/place-holder-image.png"}
                                    alt={product.name}
                                    width={200}
                                    height={200}
                                    className="rounded-xl object-cover"
                                />
                                <Divider sx={{marginTop:2, width:"80%"}} orientation="horizontal" ></Divider>
                                <h3 className="mt-4 text-md font-bold text-[#2A3788]">
                                    {product.name}
                                </h3>

                                {
                                    product.attributes.length > 0 ?
                                        <p className="text-[12px] text-[#161E50] mt-2">
                                            Fiyat Aralığı: <strong>{calculatePriceRange(attributesData as Attribute[], product.attributes, product.basePrice)}</strong>
                                        </p>
                                        :
                                        <p className="text-[12px] text-[#161E50] mt-2">
                                            Fiyat: <strong> {product.basePrice}</strong>
                                        </p>
                                }

                                <p className="text-[12px] text-[#161E50]">
                                    Ort. Yapılış Süresi: <strong>{product.averageTime}</strong>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <MessageDialog
                open={open}
                recieverImage={pageData.producer.avatar}
                recieverName={pageData.producer.name}
                onClose={() => setOpen(false)}
                receiverId={pageData.producer.id}
            />
            <CustomRequestDialog open={customReqOpen} producerId={pageData.producer.id} onClose={()=>setcustomReqOpen(false)}/>
        </div>
    );
}
