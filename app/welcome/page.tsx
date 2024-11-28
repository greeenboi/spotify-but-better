'use client';

import { AuroraBackground } from '@/components/ui/aurora-background';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TextHoverEffect } from '@/components/ui/text-hover-effect';
import { IconPlayerPlay } from '@tabler/icons-react';
import TestLoader from '../lib/test-loader';
import { open } from '@tauri-apps/plugin-dialog';
import { exists, readDir } from '@tauri-apps/plugin-fs';
import { store } from '@/lib/store/lazy-store';
import { useState } from 'react';
import Step from '@/components/ui/multi-step-wizard';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { TextLoop } from '@/components/ui/text-loop';
import { FolderOpen, User, Cog, Flag } from 'lucide-react';
import { TextMorph } from '@/components/ui/text-morph';
import type { Mp3Data } from '@/lib/types/playlist.data';
import Loader from '@/components/ui/loader';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface playlistDataType {
  path: string;
  count: number;
  files: string[];
}

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [playlistData, setPlaylistData] = useState<playlistDataType>();
  const [showForm, setShowForm] = useState(false);
  const [optionalStep1, setOptionalStep1] = useState(false);
  const [optionalStep2, setOptionalStep2] = useState('');
  const [name, setName] = useState<string>('');
  const [seeding, isSeeding] = useState(false);

  console.log(seeding);

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

  async function countMp3Files(directoryPath: string): Promise<Mp3Data> {
    isSeeding(true);
    const dirExists = await exists(directoryPath);
    if (!dirExists) {
      isSeeding(false);
      console.error('Selected directory does not exist');
    }
    const mp3Files: string[] = [];
    async function traverseDir(path: string) {
      try {
        const entries = await readDir(path);
        for (const entry of entries) {
          mp3Files.push(entry.name);
        }
      } catch (error) {
        console.error('Failed to read directory:', error);
      }
    }
    await traverseDir(directoryPath);
    isSeeding(false);
    return {
      count: mp3Files.length,
      files: mp3Files,
    };
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 mx-6 my-2">
            {name && (
              <div className="flex items-center space-x-3">
                <User className="h-6 w-6 text-primary" />
                <TextMorph className="text-3xl font-semibold">{name}</TextMorph>
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
          <Card className="w-full max-w-4xl mx-auto bg-transparent border-none">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-3xl font-semibold">
                <FolderOpen className="h-8 w-8 text-primary" />
                <span>Choose Playlist Directory</span>
              </CardTitle>
            </CardHeader>
            <CardContent className=" bg-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Button
                    variant={playlistData?.path ? 'outline' : 'default'}
                    onClick={async () => {
                      const path = await openDialog();
                      if (path) {
                        setPlaylistData({
                          path: path as string,
                          count: 0,
                          files: [],
                        });
                      }
                    }}
                    className="w-full"
                  >
                    {playlistData?.path
                      ? 'Choose Another Directory'
                      : 'Select Directory'}
                  </Button>
                  {playlistData?.path && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Alert>
                        <AlertDescription className="break-all">
                          <ScrollArea className="py-2">
                            Selected Directory: <pre>{playlistData.path}</pre>
                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={() =>
                      playlistData?.path &&
                      countMp3Files(playlistData.path)
                        .then(data => {
                          setPlaylistData(prev => ({
                            ...prev!,
                            count: data.count,
                            files: data.files,
                          }));
                          isSeeding(false);
                        })
                        .catch(error => {
                          console.error(error);
                        })
                    }
                    disabled={!playlistData?.path || seeding}
                  >
                    {seeding && <Loader />}
                    Seed Data: Count MP3 Files
                  </Button>
                </div>
                {playlistData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Tabs defaultValue="count" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="count">File Count</TabsTrigger>
                        <TabsTrigger value="list">File List</TabsTrigger>
                      </TabsList>
                      <TabsContent value="count">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-center">
                              {playlistData.count}
                            </div>
                            <div className="text-center text-muted-foreground">
                              MP3 files found
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="list">
                        <Card>
                          <CardContent className="p-0">
                            <ScrollArea className="h-[150px] w-full rounded-md border">
                              {playlistData.files.map((file, index) => (
                                <div
                                  key={index}
                                  className="py-2 border-b border-gray-600 border-dashed font-geistMono text-sm"
                                >
                                  {file}
                                </div>
                              ))}
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <div className="space-y-6 mx-6 my-2">
            <div className="flex items-center space-x-3">
              <Cog className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-semibold">Optional Step 1</h2>
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
              <h2 className="text-3xl font-semibold">Optional Step 2</h2>
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
    <AuroraBackground className="flex items-center justify-center">
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
            <div className="flex justify-between rounded p-8 w-full px-10">
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
                className="absolute top-0 left-0 right-0 p-4 w-full h-fit"
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
