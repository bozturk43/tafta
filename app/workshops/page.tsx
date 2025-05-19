import { Suspense } from "react";
import WorkShopsInner from "./WorkShopsInner";


export default async function WorkShopsPage() {
  return (
    <Suspense fallback={<div>Loading workshops page...</div>}>
      <WorkShopsInner />
    </Suspense>
  );
}
