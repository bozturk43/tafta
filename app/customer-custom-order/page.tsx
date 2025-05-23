"use client"
import { Suspense} from "react";
import CustomerCustomOrderInner from "./CustomerCustomOrderInner";
import { CircularProgress } from "@mui/material";
import { useAuth } from "@/context/authContext";


export default function CustomerCustomOrder() {
    const {user} = useAuth();
  return (
    <Suspense fallback={<CircularProgress/>}>
      {user && <CustomerCustomOrderInner user={user}/>}
    </Suspense>
  );
}
