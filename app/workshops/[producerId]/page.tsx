import { Suspense } from "react";
import ProducerPageInner from "./ProducerPageInner";
import { CircularProgress } from "@mui/material";


export default async function ProducerPage({params}:{params:Promise<{producerId:string}>}) {
  const{producerId} = await params;
  return (
    <Suspense fallback={<CircularProgress/>}>
      <ProducerPageInner producerId={producerId} />
    </Suspense>
  );
}
