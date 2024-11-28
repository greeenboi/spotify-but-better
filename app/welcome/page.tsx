'use client';

import { AuroraBackground } from '@/components/ui/aurora-background';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TextHoverEffect } from '@/components/ui/text-hover-effect';
import { IconPlayerPlay } from '@tabler/icons-react';
import TestLoader from '../lib/test-loader';
import { open } from '@tauri-apps/plugin-dialog';
import { store } from '@/lib/store/lazy-store';
import { useState } from 'react';
import Step from '@/components/ui/multi-step-wizard';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { TextLoop } from '@/components/ui/text-loop';
import { FolderOpen, User, Cog, Flag } from 'lucide-react';
import { TextMorph } from '@/components/ui/text-morph';

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [playlistPath, setPlaylistPath] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [optionalStep1, setOptionalStep1] = useState(false);
  const [optionalStep2, setOptionalStep2] = useState('');
  const [name, setName] = useState<string>('');

  const setStoreValue = async () => {
    try {
      await store.set('hasVisited', { value: true });
      console.log('Store value set successfully.');
    } catch (error) {
      console.error('Failed to set store value:', error);
    }
  };

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
          <div className="space-y-6 mx-6 my-2">
            {name && (
              <div className="flex items-center space-x-3">
                <User className="h-6 w-6 text-primary" />
                <TextMorph className="text-2xl font-semibold">{name}</TextMorph>
              </div>
            )}
            <div className="space-y-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 mx-6 my-2">
            <div className="flex items-center space-x-3">
              <FolderOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">
                Choose Playlist Directory
              </h2>
            </div>
            <div className="space-y-4 flex flex-col items-center">
              <Button
                variant={playlistPath ? 'ghost' : 'default'}
                onClick={async () => {
                  const path = await openDialog();
                  if (path) {
                    setPlaylistPath(path as string);
                  }
                }}
                className="w-full max-w-md"
              >
                {playlistPath ? 'Choose Another Directory' : 'Select Directory'}
              </Button>
              {playlistPath && (
                <div className="space-y-2 w-full my-2 max-w-md">
                  <Label>Selected Directory:</Label>
                  <Card>
                    <CardContent className="p-3 text-sm text-muted-foreground break-all">
                      {playlistPath}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 mx-6 my-2">
            <div className="flex items-center space-x-3">
              <Cog className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Optional Step 1</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="optional-step-1"
                checked={optionalStep1}
                onCheckedChange={checked =>
                  setOptionalStep1(checked as boolean)
                }
              />
              <Label htmlFor="optional-step-1">Enable optional feature</Label>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 mx-6 my-2">
            <div className="flex items-center space-x-3">
              <Flag className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Optional Step 2</h2>
            </div>
            <div className="space-y-4">
              <Label htmlFor="optional-step-2">Additional Information</Label>
              <Input
                id="optional-step-2"
                type="text"
                value={optionalStep2}
                onChange={e => setOptionalStep2(e.target.value)}
                placeholder="Enter additional information"
              />
            </div>
          </div>
        );
      default:
        return null;
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
          ease: 'easeInOut',
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4 w-full"
      >
        {!showForm ? (
          <section className="max-w-5xl h-full">
            <TextHoverEffect text="SONDER" automatic duration={5} />
            <section className="grid grid-cols-2 gap-8">
              <div className="col-span-2 font-extralight text-balance font-geistMono text-base w-xl text-center md:text-2xl text-neutral-200 text-opacity-50 py-4">
                Music is the strongest form of{' '}
                <span className="inline-block min-w-[80px]">
                  {' '}
                  {/* Fixed width container */}
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
                className="font-geist"
                onClick={() => setShowForm(true)}
              >
                <IconPlayerPlay /> Get Started
              </Button>
              <TestLoader />
            </section>
          </section>
        ) : (
          <Card className="mx-auto w-full max-w-xl bg-background/40 backdrop-blur-xl border-neutral-200/20">
            <div className="flex justify-between rounded p-8 w-full">
              <Step step={1} currentStep={step} />
              <Step step={2} currentStep={step} />
              <Step step={3} currentStep={step} />
              <Step step={4} currentStep={step} />
            </div>
            <CardContent
              className="px-8 relative w-full"
              style={{ minHeight: '300px' }}
            >
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute top-0 left-0 right-0 p-4 w-full"
              >
                {renderStepContent()}
              </motion.div>
            </CardContent>

            <div className="px-8 pb-8">
              <div className="mt-10 flex justify-between">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (step > 1) {
                      setStep(step - 1);
                    }
                  }}
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
  );
}
