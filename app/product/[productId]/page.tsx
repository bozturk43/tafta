import { Suspense } from "react";
import ProductDetailInner from "./ProductDetailInner";


export default async function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
    const { productId } = await params;

    return (
        <Suspense fallback={<div>Loading product page...</div>}>
            <ProductDetailInner productId={productId} />
        </Suspense>
    );
}
