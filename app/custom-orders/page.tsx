import { Suspense } from "react";
import CustomOrderInner from "./CustomOrderInner";


export default async function CustomOrders() {
  return (
    <Suspense fallback={<div>Loading prodcer page...</div>}>
      <CustomOrderInner/>
    </Suspense>
  );
}
