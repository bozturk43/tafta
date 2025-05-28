import { Box } from "@mui/material";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-8 items-center justify-center">
        <Box component="img" src="./home/1.png" style={{ objectFit: "cover", width: "80%" }} alt="example" />
        <Box component="img" src="./home/2.png" style={{ objectFit: "cover", width: "80%" }} alt="example" />
        <div className="flex flex-col items-center mt-14 mb-4">
          <Box component="img" src="./home/4.png" style={{ objectFit: "initial", width: "80%" }} alt="example" />
          <div className="grid grid-cols-2 items-center justifty-center gap-4 p-4">
            <div className="flex bg-[#97C11F] rounded-full p-2 min-w-[200px] items-center gap-2">
              <Image width={60} height={60} alt="profil" src={"/tafta-logo.png"}></Image>
              <p>Satıcı 1 Bölgesi</p>
            </div>
            <div className="flex bg-[#F0D300] rounded-full p-2 min-w-[200px] items-center gap-2">
              <Image width={60} height={60} alt="profil" src={"/tafta-logo.png"}></Image>
              <p>Satıcı 2 Bölgesi</p>
            </div>
            <div className="flex bg-[#E42528] rounded-full p-2 min-w-[200px] items-center gap-2">
              <Image width={60} height={60} alt="profil" src={"/tafta-logo.png"}></Image>
              <p>Satıcı 3 Bölgesi</p>
            </div>
            <div className="flex bg-[#F9F9F9] rounded-full p-2 min-w-[200px] items-center gap-2">
              <Image width={60} height={60} alt="profil" src={"/tafta-logo.png"}></Image>
              <p>Satıcı 4 Bölgesi</p>
            </div>
          </div>
        </div>
        <Box component="img" src="./home/5.png" style={{ objectFit: "cover", width: "80%" }} alt="example" />
        <Box component="img" src="./home/6.png" style={{ objectFit: "cover", width: "80%" }} alt="example" />

      </div>
    </div>
  );
}
