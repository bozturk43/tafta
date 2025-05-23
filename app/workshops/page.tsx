import { Suspense } from "react";
import WorkShopsInner from "./WorkShopsInner";
import { CircularProgress } from "@mui/material";


export default async function WorkShopsPage() {
  return (
    <Suspense fallback={<CircularProgress/>}>
      <WorkShopsInner />
    </Suspense>
  );
}
