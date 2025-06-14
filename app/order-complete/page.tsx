// /pages/order-complete.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const OrderCompletePage = () => {
    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const router = useRouter();


    useEffect(() => {
        const storedOrder = sessionStorage.getItem("orderNumber");

        if (!storedOrder) {
            router.replace("/");
            return;
        }

        setOrderNumber(storedOrder);

        const handleBeforeUnload = () => {
            sessionStorage.removeItem("orderNumber");
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);


    if (!orderNumber) return null;

    return (
        <div className="flex flex-col items-center  text-center min-h-screen p-6 mt-8">
            <div className="flex gap-4 mb-18">
                <div className="flex flex-row bg-[#89CAFD] p-2 rounded-md items-center gap-2">
                    <Image src="/complete-order-id.png" width={40} height={40} alt="order-id-icon"></Image>
                    <span className="text-white">Sipariş Numaran: <strong>{orderNumber}</strong></span>
                </div>
                <div className="flex flex-row bg-[#89CAFD] p-2 rounded-md flex items-center gap-2">
                    <Image src="/complete-order-iban.png" width={40} height={40} alt="order-id-iban"></Image>
                    <span className="text-white">IBAN: <strong>TR33 0006 1005 1978 6457 8413 26</strong></span>
                </div>
            </div>

            <h1 className="text-4xl font-bold mb-4 text-[#2A3788]">Şimdi Sıra Ustamızda</h1>
            <p className="text-lg mb-4 text-[#2A3788]">
                Ürünün, senin seçimlerinle şekillenecek ve sevgiyle hazırlanacak.
                Güzel şeyler zaman alır ama buna değecek. <br></br>Üretime başlayabilmemiz için
                ödemenin, <strong>sipariş numaran açıklama kısmına yazılarak</strong> IBAN’a
                yapılması ve <br></br><strong>3 iş günü</strong> içinde tamamlanması yeterli.
            </p>
            <p className="text-lg text-[#2A3788]">Merak etme, her adımda yanında olacağız.</p>
            <Image className="mt-12" src="/complete-order-logo.png" width={150} height={150} alt="order-id-iban"></Image>

        </div>
    );
};

export default OrderCompletePage;
