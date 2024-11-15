"use client";

import { AuroraBackground } from '@/components/ui/aurora-background'
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button'
import { Link } from "react-transition-progress/next";
import { TextHoverEffect } from '@/components/ui/text-hover-effect'
import { IconPlayerPlay } from '@tabler/icons-react';
import TestLoader from './lib/test-loader';

export default function Home() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <TextHoverEffect text='SONDER' automatic duration={5}/>
        <section className='grid grid-cols-2 gap-8'>
          <div className="col-span-2 font-extralight font-geistMono text-base max-w-xl text-center md:text-2xl text-neutral-200 text-opacity-50 py-4">
            Music is the strongest form of magic
          </div>
          <Button variant="default" className='font-geist' asChild>
            <Link href="/player">
              <IconPlayerPlay /> Get Started
            </Link>
          </Button>
          <TestLoader />
        </section>
      </motion.div>
    </AuroraBackground>
  )
}