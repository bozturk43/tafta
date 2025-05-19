// components/MasterCard.tsx
import { Avatar, Card, CardContent } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from 'next/image'

interface MasterCardProps {
  producerId: string;
  name: string;
  title: string;
  avatar: string;
  generalImages: string[];
}

export default function ProducerCard({ producerId, name, title, avatar, generalImages }: MasterCardProps) {
    const router = useRouter();

  return (
    <Card className="p-4 rounded-xl border border-lime-300">
      <CardContent className="flex gap-4 items-center">
        <div className="flex flex-col items-center cursor-pointer" onClick={()=>router.push(`workshops/${producerId}`)}>
          <Avatar
            src={avatar}
            className="border-2 border-gray-200 cursor-pointer w-[80px] h-[80px]"
            sx={{ fontSize: '3rem', width: 100, height: 100 }}>
            {name?.charAt(0) || 'A'}
          </Avatar>
          <div className="mt-2 text-center">
            <p className="font-semibold text-black text-sm">{name}</p>
            <p className="text-xs text-gray-600">{title}</p>
          </div>
        </div>
        {
          generalImages && generalImages.length > 0 ?
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 ps-4">
              {generalImages.map((item: string, i) => (
                <div
                  key={i}
                  className="w-12 h-12 bg-gray-200 rounded-md"
                >
                  <Image src={item} alt="product_image" width={50} height={50}></Image>
                </div>
              ))}
            </div>
            :
            <div>
              Henüz ustamızın satışa hazır bir ürünü yok.
            </div>
        }

      </CardContent>
    </Card>
  );
}
