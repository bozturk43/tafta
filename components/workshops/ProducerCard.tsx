// components/MasterCard.tsx
import { Avatar, Card, CardContent } from "@mui/material";

interface MasterCardProps {
  name: string;
  title: string;
}

export default function ProducerCard({ name, title }: MasterCardProps) {
  return (
    <Card className="p-4 rounded-xl border border-lime-300">
      <CardContent className="flex gap-4 items-center">
        <div className="flex flex-col items-center">
          <Avatar sx={{ width: 80, height: 80 }} />
          <div className="mt-2 text-center">
            <p className="font-semibold text-black text-sm">{name}</p>
            <p className="text-xs text-gray-600">{title}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 ps-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-12 h-12 bg-gray-200 rounded-md"
            ></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
