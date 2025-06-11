import { Box } from "@mui/material";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-8 items-center justify-center">
        <Box component="img" src="./home/1.png" style={{ objectFit: "cover", width: "80%" }} alt="example" />
        <Box component="img" src="./home/2.png" style={{ objectFit: "cover", width: "80%" }} alt="example" />
        <div className="flex flex-col items-center mt-36 mb-4 gap-12">
          <Box component="img" src="./home/4.png" style={{ objectFit: "initial", width: "80%" }} alt="example" />
          <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-4 p-4">
            <div className="flex bg-[#2a3788] rounded-full p-2 min-w-[400px] min-h-[80px] items-center gap-2">
              <Image width={60} height={60} alt="profil" src={"/tafta-logo.png"}></Image>
              <div className="flex flex-col">
                <p className="text-[#89cafd] font-semibold text-[22px]">Satıcı 1 Adı</p>
                <p className="text-[#89cafd] text-[16px]">Satıcı 1 Başlık</p>
              </div>
            </div>
            <div className="flex bg-[#89cafd] rounded-full p-2 min-w-[400px] min-h-[80px] items-center gap-2">
              <Image width={60} height={60} alt="profil" src={"/tafta-logo.png"}></Image>
              <div className="flex flex-col">
                <p className="text-[#161e50] font-semibold text-[22px]">Satıcı 2 Adı</p>
                <p className="text-[#161e50] text-[16px]">Satıcı 2 Başlık</p>
              </div>            </div>
            <div className="flex bg-[#89cafd] rounded-full p-2 min-w-[400px] min-h-[80px] items-center gap-2">
              <Image width={60} height={60} alt="profil" src={"/tafta-logo.png"}></Image>
              <div className="flex flex-col">
                <p className="text-[#161e50] font-semibold text-[22px]">Satıcı 3 Adı</p>
                <p className="text-[#161e50] text-[16px]">Satıcı 3 Başlık</p>
              </div>
            </div>
            <div className="flex bg-[#2a3788] rounded-full p-2 min-w-[400px] min-h-[80px] items-center gap-2">
              <Image width={60} height={60} alt="profil" src={"/tafta-logo.png"}></Image>
              <div className="flex flex-col">
                <p className="text-[#89cafd] font-semibold text-[22px]">Satıcı 4 Adı</p>
                <p className="text-[#89cafd] text-[16px]">Satıcı 4 Başlık</p>
              </div>
            </div>
          </div>
        </div>
        <Box component="img" src="./home/5.png" style={{ objectFit: "cover" }} alt="example" />
        <Box component="img" src="./home/6.png" style={{ objectFit: "cover", width: "80%" }} alt="example" />
        <Box component="img" src="./home/7.png" style={{ objectFit: "cover", width: "80%" }} alt="example" />

      </div>
    </div>
  );
}
