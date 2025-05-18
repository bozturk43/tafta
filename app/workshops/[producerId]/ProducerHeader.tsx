import Image from "next/image";

interface Props {
  name: string;
  title: string;
  description: string;
  avatarUrl: string;
}

export default function ProducerHeader({ name, title, description, avatarUrl }: Props) {
  return (
    <div className="bg-blue-900 text-white py-8 px-4 flex flex-col items-center">
      <Image
        src={avatarUrl}
        alt={name}
        width={100}
        height={100}
        className="rounded-full border-4 border-white shadow-md mb-4"
      />
      <h1 className="text-2xl font-bold">{name}’ün Atölyesi</h1>
      <p className="text-sm font-light italic">{title}</p>
      <p className="mt-4 max-w-2xl text-center text-white/90">{description}</p>
    </div>
  );
}
