import { Suspense } from "react";
import ProducerPageInner from "./ProducerPageInner";


export default async function ProducerPage({params}:{params:Promise<{producerId:string}>}) {
  const{producerId} = await params;
  return (
    <Suspense fallback={<div>Loading prodcer page...</div>}>
      <ProducerPageInner producerId={producerId} />
    </Suspense>
  );
}
