import { Suspense } from "react";
import RegisterPageInner from "./RegisterPageInner";

type FormValues = {
  name: string;
  email: string;
  password: string;
  title: string;
  description: string;
};

export default async function RegisterPage({params}:{params:Promise<{type:string}>}) {
 const {type} = await params;

 return(
    <Suspense fallback={<div> Kayıt Ol Sayfası Yükleniyor...</div>}>
        <RegisterPageInner type={type}/>
    </Suspense>
 )
}
