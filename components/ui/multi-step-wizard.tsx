import { motion } from 'framer-motion';
import type { ComponentProps } from 'react';

export default function Step({
  step,
  currentStep,
}: { step: number; currentStep: number }) {
  const status =
    currentStep === step
      ? 'active'
      : currentStep < step
        ? 'inactive'
        : 'complete';

  return (
    <div className="relative h-8 w-8">
      {' '}
      {/* Fixed size container */}
      <motion.div animate={status} className="absolute inset-0">
        <motion.div
          variants={{
            active: {
              scale: 1,
            },
            complete: {
              scale: 1,
            },
            inactive: {
              scale: 1,
            },
          }}
          className="relative h-full w-full"
        >
          <motion.div
            variants={{
              active: {
                scale: 1,
                transition: { delay: 0, duration: 0.2 },
              },
              complete: {
                scale: 1.25,
              },
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              type: 'tween',
              ease: 'circOut',
            }}
            className="absolute inset-0 rounded-full bg-[hsl(142.1,70.6%,25%)]"
          />

          <motion.div
            initial={false}
            variants={{
              inactive: {
                backgroundColor: 'hsla(20, 14.3%, 4.1%, 1)',
                borderColor: 'hsl(20, 14.3%, 15%)',
                color: 'hsl(20, 17.3%, 25%)',
              },
              active: {
                backgroundColor: 'hsl(20, 14.3%, 4.1%)',
                borderColor: 'hsl(142.1, 70.6%, 45.3%)',
                color: 'hsl(142.1, 70.6%, 45.3%)',
              },
              complete: {
                backgroundColor: 'hsl(142.1, 70.6%, 45.3%)',
                borderColor: 'hsl(142.1, 70.6%, 45.3%)',
                color: 'hsl(142.1, 70.6%, 45.3%)',
              },
            }}
            transition={{ duration: 0.2 }}
            className="relative flex h-full w-full items-center justify-center rounded-full border-2 font-semibold"
          >
            <div className="flex items-center justify-center">
              {status === 'complete' ? (
                <CheckIcon className="h-6 w-6 text-white" />
              ) : (
                <span>{step}</span>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function CheckIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <title>Check icon</title>
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.2,
          type: 'tween',
          ease: 'easeOut',
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
