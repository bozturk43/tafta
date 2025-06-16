"use client"
import { Avatar, Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();
  const handleClick = (id:string) => {
    router.push(`/workshops/${id}`); // yönlendirmek istediğin sayfanın yolu
  };
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center">
        <Box component="img" src="./home/9.png" style={{ objectFit: "cover", width: "80%", marginTop: "-20px", cursor:"pointer" }} alt="example" onClick={()=> router.push("/workshops")} />
        <Box component="img" src="./home/2.png" style={{ objectFit: "cover", width: "90%", marginTop: "-120px" }} alt="example" />
        <div className="flex flex-col items-center mb-4 gap-12" style={{ marginTop: "-50px" }}>
          <Box component="img" src="./home/4.png" style={{ objectFit: "initial", width: "100%" }} alt="example" />
          <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-4 p-4">
            <div className="flex bg-[#2a3788] rounded-full p-2 min-w-[400px] min-h-[80px] items-center gap-2 hover:cursor-pointer" onClick={()=>handleClick("BhLRWuvQiJn9ywQqHNcY")}>
                <Avatar sx={{width:60,height:60}} src="https://tafta-pied.vercel.app/_next/image?url=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Ftafta-50e89.firebasestorage.app%2Fo%2Fproducer_profile_images%252FBhLRWuvQiJn9ywQqHNcY%3Falt%3Dmedia%26token%3De554075d-13e5-4be5-b658-70137734d68b&w=256&q=75"></Avatar>
              <div className="flex flex-col">
                <p className="text-[#89cafd] font-semibold text-[22px]">Onur Şentürk</p>
                <p className="text-[#89cafd] text-[16px]">Seramik Sanatçısı</p>
              </div>
            </div>
            <div className="flex bg-[#89cafd] rounded-full p-2 min-w-[400px] min-h-[80px] items-center gap-2 hover:cursor-pointer" onClick={()=>handleClick("DfddzQ81dXymzkjuULXB")}>
              <Avatar sx={{width:60,height:60}} src="https://tafta-pied.vercel.app/_next/image?url=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Ftafta-50e89.firebasestorage.app%2Fo%2Fproducer_profile_images%252FDfddzQ81dXymzkjuULXB%3Falt%3Dmedia%26token%3D19c53b44-79c3-4a5d-a976-9800c43b943c&w=256&q=75"></Avatar>
              <div className="flex flex-col">
                <p className="text-[#161e50] font-semibold text-[22px]">Ahsen Cayan</p>
                <p className="text-[#161e50] text-[16px]">Çanta Örgü Ustası</p>
              </div>            </div>
            <div className="flex bg-[#89cafd] rounded-full p-2 min-w-[400px] min-h-[80px] items-center gap-2 hover:cursor-pointer" onClick={()=>handleClick("3nM0Fzu263dCwhCEuTZk")}>
              <Avatar sx={{width:60,height:60}} src="https://tafta-pied.vercel.app/_next/image?url=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Ftafta-50e89.firebasestorage.app%2Fo%2Fproducer_profile_images%252F3nM0Fzu263dCwhCEuTZk%3Falt%3Dmedia%26token%3Ddcf8bfd7-c8e1-46e7-b15e-f2f9b66a68b2&w=256&q=75"></Avatar>
              <div className="flex flex-col">
                <p className="text-[#161e50] font-semibold text-[22px]">Hümeyra</p>
                <p className="text-[#161e50] text-[16px]">Punch Ustası</p>
              </div>
            </div>
            <div className="flex bg-[#2a3788] rounded-full p-2 min-w-[400px] min-h-[80px] items-center gap-2 hover:cursor-pointer" onClick={()=>handleClick("a4tBdZxEOLSzJ8cbxTA4")}>
              <Avatar sx={{width:60,height:60}} src="https://tafta-pied.vercel.app/_next/image?url=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Ftafta-50e89.firebasestorage.app%2Fo%2Fproducer_profile_images%252Fa4tBdZxEOLSzJ8cbxTA4%3Falt%3Dmedia%26token%3D4e3d349b-5b8e-404b-bed6-d86514a47b0c&w=256&q=75"></Avatar>
              <div className="flex flex-col">
                <p className="text-[#89cafd] font-semibold text-[22px]">Ayşe Gül</p>
                <p className="text-[#89cafd] text-[16px]">Örgü Ustası</p>
              </div>
            </div>
          </div>
        </div>
        <Box component="img" onClick={()=>handleClick("BhLRWuvQiJn9ywQqHNcY")}src="./home/5.png" style={{ objectFit: "cover", width: "80%", marginTop: "130px", cursor:"pointer"}} alt="example" />
        <Box component="img" onClick={()=>handleClick("DfddzQ81dXymzkjuULXB")} src="./home/6.png" style={{ objectFit: "cover", width: "90%", marginTop: "130px", cursor:"pointer" }} alt="example" />
        <Box component="img" onClick={()=>handleClick("a4tBdZxEOLSzJ8cbxTA4")} src="./home/7.png" style={{ objectFit: "cover", width: "90%", marginTop: "150px", cursor:"pointer" }} alt="example" />

      </div>
    </div>
  );
}
