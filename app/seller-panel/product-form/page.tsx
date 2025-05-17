// app/seller-panel/product-form/page.tsx
import { Suspense } from 'react';
import ProductFormInner from './ProductFormInner';

export default function ProductFormPage() {
  return (
    <Suspense fallback={<div>Loading product form...</div>}>
      <ProductFormInner/>
    </Suspense>
  );
}