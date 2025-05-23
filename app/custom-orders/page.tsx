"use client"
import { Suspense } from "react";
import CustomOrderInner from "./CustomOrderInner";
import { CircularProgress } from "@mui/material";
import { useAuth } from "@/context/authContext";


export default function CustomOrders() {
  const {user} = useAuth();
  return ( 
    <Suspense fallback={<CircularProgress></CircularProgress>}>
      {user && <CustomOrderInner user={user}/>}
    </Suspense>
  );
}
