import { mockProducer } from "./mockData";
import Image from "next/image";

export default function ProducerPage() {
  const data = mockProducer;

  return (
    <div className="min-h-screen bg-white">
      {/* Üst Başlık */}
      <div className="bg-blue-900 text-white py-6 text-center relative">
        <h1 className="text-2xl font-bold">{data.name}’ün Atölyesi</h1>
        <p className="text-sm mt-1">Üretmekten Mutluluk Duydukları</p>
      </div>

      <div className="flex flex-col lg:flex-row pe-4">
        {/* Sol Kısım: Üretici Bilgileri */}
        <div className="w-full h-full lg:w-1/4 h-screen bg-white rounded-xl shadow-lg p-6 relative z-10">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg -mt-16 overflow-hidden">
              <Image
                src={data.avatarUrl}
                alt="Üretici"
                width={112}
                height={112}
                className="object-cover"
              />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-blue-800">{data.name}</h2>
            <p className="text-blue-500">{data.title}</p>
            <p className="text-gray-700 mt-4 text-sm whitespace-pre-line text-center">
              {data.description}
            </p>

            {/* Butonlar */}
            <div className="mt-6 flex flex-col gap-4 w-full">
              <button className="bg-red-100 text-red-600 py-2 rounded-full text-sm hover:bg-red-200 transition">
                Ürünün kalbine bir yolculuk izlemek istersen, tıkla.
              </button>
              <button className="bg-green-500 text-white py-2 rounded-full text-sm hover:bg-green-600 transition">
                Yeni Bir Fikrin mi Var? Özel Sipariş İste
              </button>
              <button className="border border-gray-400 text-gray-800 py-2 rounded-full text-sm hover:bg-gray-100 transition">
                Usta ile İletişime Geç
              </button>
            </div>
          </div>
        </div>

        {/* Sağ Kısım: Ürünler */}
        <div className="w-full lg:w-3/4 mt-8 lg:mt-4 lg:ml-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.products.map((product, idx) => (
              <div
                key={idx}
                className="bg-blue-50 rounded-xl shadow p-4 flex flex-col items-center"
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="rounded-xl object-cover"
                />
                <h3 className="mt-4 text-md font-bold text-blue-800">
                  {product.name}
                </h3>
                <p className="text-sm">
                  Fiyat Aralığı: <strong>{product.priceRange}</strong>
                </p>
                <p className="text-sm">
                  Ort. Yapılış Süresi: <strong>{product.duration}</strong>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
