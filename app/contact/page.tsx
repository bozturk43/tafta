// /pages/order-complete.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const OrderCompletePage = () => {


    return (
        <div className="flex flex-col items-center  text-center min-h-screen p-6 mt-8">
            <div className="flex gap-4 mb-18">
                <div className="flex flex-row bg-[#89CAFD] p-2 rounded-md items-center gap-2">
                    <Image src="/complete-order-id.png" width={40} height={40} alt="order-id-icon"></Image>
                    <span className="text-white"><strong>534 516 15 97</strong></span>
                </div>
                <div className="flex flex-row bg-[#89CAFD] p-2 rounded-md flex items-center gap-2">
                    <Image src="/complete-order-iban.png" width={40} height={40} alt="order-id-iban"></Image>
                    <span className="text-white"><strong>iletisim.tafta@gmail.com</strong></span>
                </div>
            </div>

            <h1 className="text-4xl font-bold mb-4 text-[#2A3788]"> Bize Uğramadan Geçme</h1>
            <p className="text-lg mb-4 text-[#2A3788]">
                İçinde “sorsam mı acaba?” diyen bir ses varsa, biz çoktan dinlemeye hazırız.
                <br></br>Tafta sadece el işi değil, aynı zamanda gönül işi. Aklına takılan her şeyde çözüm bulmak için buradayız.
            </p>
            <Image className="mt-12" src="/complete-order-logo.png" width={150} height={150} alt="order-id-iban"></Image>

        </div>
    );
};

export default OrderCompletePage;
