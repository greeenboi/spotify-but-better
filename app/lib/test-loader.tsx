import { Button } from '@/components/ui/button';
import React from 'react'
import { startTransition } from "react";
import { useProgress } from "react-transition-progress";
const TestLoader = () => {
  const startProgress = useProgress();
  return (
    <Button
      variant="secondary"
      className='font-geist'
      onClick={() => {
        startTransition(async () => {
          startProgress();
          await new Promise((resolve) => setTimeout(resolve, 2000));
        });
      }}
    >
      Trigger transition
    </Button>
  )
}

export default TestLoader