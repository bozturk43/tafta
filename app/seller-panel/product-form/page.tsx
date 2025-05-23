// app/seller-panel/product-form/page.tsx
import { Suspense } from 'react';
import ProductFormInner from './ProductFormInner';
import { CircularProgress } from '@mui/material';

export default function ProductFormPage() {
  return (
    <Suspense fallback={<CircularProgress/>}>
      <ProductFormInner/>
    </Suspense>
  );
}