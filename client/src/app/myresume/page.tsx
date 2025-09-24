// file: src/app/myresume/page.tsx

import { Suspense } from 'react';
import MyResumeFeatures from '../../components/MyResumeFeatures'; // Import the child

// This is the parent. Its only job is to wrap the child in Suspense.
export default function Features() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyResumeFeatures />
    </Suspense>
  );
}