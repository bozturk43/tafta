'use client';

import ProducerCard from "@/components/workshops/ProducerCard";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getWorkshopsData } from "../lib/api/getWorkShopsData";


export default function WorkShopsInner() {

    const { data: workshopsData, isLoading: workShopsIsLoading, error: workShopsError } = useQuery({
        queryKey: ["workshopData"],
        queryFn: () => getWorkshopsData(),
    });

    if (workShopsIsLoading) {
        return (
            <div>Veriler yükleniyor</div>
        )
    };
    if (workShopsError) {
        return (
            <div>Veriler Alınırken Hata Oluştu</div>
        )
    };
    return (
        <div className="p-16">
            <Typography variant="h3" color="primary" fontWeight={800} className="text-center">
                Atölyeler
            </Typography>
            <Typography variant="h6" className="text-center" color="primary">
                Hikayeyi Birlikte Yaratacağın Ustayı Seç
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
                {workshopsData.producers.map((producer, idx) => (
                    <ProducerCard 
                    key={idx}
                    producerId={producer.id} 
                    avatar={producer.avatar}
                    name={producer.name} 
                    title={producer.title} 
                    generalImages={producer.generalImages} />
                ))}
            </div>
        </div>
    );
}
