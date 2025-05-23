import { Suspense } from 'react';
import MessagesInner from './MessagesInner';
import { CircularProgress } from '@mui/material';

export default function ProducerMessagesPage() {
  return (
    <Suspense fallback={<CircularProgress/>}>
      <MessagesInner/>
    </Suspense>
  );
}