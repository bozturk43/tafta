'use client';

import ProducerCard from "@/components/workshops/ProducerCard";
import { Typography } from "@mui/material";


export default function WorkshopsPage() {
  const masters = [
    { name: "Onur & Emre", title: "Seramik Ustaları" },
    { name: "Ayşegül", title: "Dikiş Ustası" },
    { name: "Hümeyra", title: "Punch Ustası" },
    { name: "Ahsen", title: "Çanta Ustası" },
  ];

  return (
    <div className="p-16">
        <Typography variant="h4" color="primary" fontWeight={800} className="text-center">
            Atölyeler
        </Typography>
        <Typography variant="body1" className="text-center"color="primary"> 
            Hikayeyi Birlikte Yaratacağın Ustayı Seç
        </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
        {masters.map((master, idx) => (
          <ProducerCard key={idx} name={master.name} title={master.title} />
        ))}
      </div>
    </div>
  );
}
