import Image from "next/image";

interface Props {
  name: string;
  priceRange: string;
  duration: string;
  imageUrl: string;
}

export default function ProductCard({ name, priceRange, duration, imageUrl }: Props) {
  return (
    <div className="bg-blue-50 rounded-xl shadow p-4 text-center">
      <div className="w-full h-48 relative mb-4">
        <Image src={imageUrl} alt={name} layout="fill" objectFit="contain" />
      </div>
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">Fiyat Aralığı: <span className="font-bold">{priceRange}</span></p>
      <p className="text-sm text-gray-600">Ort. Yapılış Süresi: <span className="font-bold">{duration}</span></p>
    </div>
  );
}
