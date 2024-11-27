"use client";

import { AuroraBackground } from '@/components/ui/aurora-background'
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button'
import { TextHoverEffect } from '@/components/ui/text-hover-effect'
import { IconPlayerPlay } from '@tabler/icons-react';
import TestLoader from '../lib/test-loader';
import { open } from '@tauri-apps/plugin-dialog';
import { store } from '@/lib/store/lazy-store';
import { useState } from 'react';
import Step from '@/components/ui/multi-step-wizard';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { TextLoop } from '@/components/ui/text-loop';

export default function Home() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [playlistPath, setPlaylistPath] = useState<string>('');
    const [showForm, setShowForm] = useState(false);
    const setStoreValue = async () => {
      try {
        await store.set('hasVisited', { value: true });
        console.log('Store value set successfully.');
        } catch (error) {
            console.error('Failed to set store value:', error);
        }
    };
    const [name, setName] = useState<string>('');

    const openDialog = async () => {
        const file = await open({
            multiple: false,
            directory: true,
            canCreateDirectories: true,
            title: 'Select Playlist Directory',
        });
        return file;
      };
    const renderStepContent = () => {
        switch (step) {
          case 1:
            return (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Choose Playlist Directory</h2>
                <div className="space-y-2">
                  <Button onClick={async () => {
                    const path = await openDialog();
                    if (path) {
                      setPlaylistPath(path as string);
                      setStep(2);
                      console.log('Selected path:', path);
                    }
                  }}>
                    Select Directory
                  </Button>
                  {playlistPath && (
                    <div className="mt-4">
                      <Label>Selected Directory:</Label>
                      <Card className="mt-2">
                        <CardContent className="p-3 text-sm text-muted-foreground break-all">
                          {playlistPath}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            );
          case 2:
            return (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Enter Your Name</h2>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
              </div>
            );
          case 3:
            return (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Optional Step 1</h2>
                {/* Add content */}
              </div>
            );
          case 4:
            return (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Optional Step 2</h2>
                {/* Add content */}
              </div>
            );
        }
      };

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
        {!showForm ? (
          <>
            <TextHoverEffect text='SONDER' automatic duration={5}/>
            <section className='grid grid-cols-2 gap-8'>
              <div className="col-span-2 font-extralight text-balance font-geistMono text-base w-xl text-center md:text-2xl text-neutral-200 text-opacity-50 py-4">
                Music is the strongest form of{' '}
                <span className="inline-block min-w-[80px]"> {/* Fixed width container */}
                  <TextLoop>
                      <p className="min-w-[80px] text-left">Magic</p>
                      <p className="min-w-[80px] text-left">Love</p>
                      <p className="min-w-[80px] text-left">Fun</p>
                      <p className="min-w-[80px] text-left">😜🫠</p>
                      <p className="min-w-[80px] text-left">Ecstasy</p>
                      <p className="min-w-[80px] text-left">Vibes</p>
                  </TextLoop>
                </span>
              </div>
              <Button
                variant="default"
                className='font-geist'
                onClick={() => setShowForm(true)}
              >
                <IconPlayerPlay /> Get Started
              </Button>
              <TestLoader />
            </section>
          </>
        ) : (
          <Card className="mx-auto w-full max-w-2xl">
            <div className="flex justify-between rounded p-8">
              <Step step={1} currentStep={step} />
              <Step step={2} currentStep={step} />
              <Step step={3} currentStep={step} />
              <Step step={4} currentStep={step} />
            </div>

            <CardContent className="px-8">
              {renderStepContent()}
            </CardContent>

            <div className="px-8 pb-8">
              <div className="mt-10 flex justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setStep(step < 2 ? step : step - 1)}
                  disabled={step === 1}
                >
                  Back
                </Button>
                <Button
                  onClick={async () => {
                    if (step === 4) {
                      await setStoreValue();
                      await store.set('userName', { value: name });
                      await store.save();
                      router.push('/player');
                    } else {
                      setStep(step + 1);
                    }
                  }}
                  disabled={step > 4}
                >
                  {step === 4 ? 'Finish' : 'Continue'}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </motion.div>
    </AuroraBackground>
  )
}