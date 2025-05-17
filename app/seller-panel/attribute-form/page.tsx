// app/seller-panel/product-form/page.tsx
import { Suspense } from 'react';
import AttributeFormInner from './AttributeFormInner';

export default function AttributeFormPage() {
  return (
    <Suspense fallback={<div>Loading product form...</div>}>
      <AttributeFormInner/>
    </Suspense>
  );
}