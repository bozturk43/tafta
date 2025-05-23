import { Suspense } from "react";
import RegisterPageInner from "./RegisterPageInner";
import { CircularProgress } from "@mui/material";

export default async function RegisterPage({params}:{params:Promise<{type:string}>}) {
 const {type} = await params;

 return(
    <Suspense fallback={<CircularProgress/>}>
        <RegisterPageInner type={type}/>
    </Suspense>
 )
}
