// app/seller-panel/product-form/page.tsx
import { Suspense } from 'react';
import AttributeFormInner from './AttributeFormInner';
import { CircularProgress } from '@mui/material';

export default function AttributeFormPage() {
  return (
    <Suspense fallback={<CircularProgress/>}>
      <AttributeFormInner/>
    </Suspense>
  );
}