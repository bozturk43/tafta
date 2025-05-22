// app/seller-panel/product-form/page.tsx
import { Suspense } from 'react';
import MessagesInner from './MessagesInner';

export default function ProducerMessagesPage() {
  return (
    <Suspense fallback={<div>Loading messages ...</div>}>
      <MessagesInner/>
    </Suspense>
  );
}