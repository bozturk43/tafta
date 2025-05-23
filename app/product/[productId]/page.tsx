import { Suspense } from "react";
import ProductDetailInner from "./ProductDetailInner";
import { CircularProgress } from "@mui/material";


export default async function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
    const { productId } = await params;

    return (
        <Suspense fallback={<CircularProgress/>}>
            <ProductDetailInner productId={productId} />
        </Suspense>
    );
}
