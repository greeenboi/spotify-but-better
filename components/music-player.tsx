/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PlayCircle, PauseCircle, Volume2, VolumeX, Eye, EyeOff, StepBack, StepForward, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import type { AudioPlayerProps, AudioState, VisualizerConfig } from '@/lib/types/audio.player';
import { Player } from '@/lib/player';

const DEFAULT_CONFIG: VisualizerConfig = {
  barWidth: 4,
  barGap: 2,
  minHeight: 2,
  maxHeight: 100,
  colors: {
    start: '#1C1917',
    end: '#22C55E',
  },
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  playlist,
  onError,
  onPlay,
  onPause,
  onTrackChange
}) => {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    isMuted: false,
    volume: 0.5,
    currentTrack: 0,
    playlist: playlist,
    isLooping: false,
  });

  // Add states for UI interactions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isHovering, setIsHovering] = useState(false);
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);

  // const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const progressUpdateInterval = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<Player | null>(null);

  const cleanupAudioContext = useCallback(() => {
    console.log('Cleaning up audio context connections');
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
    }
  }, []);

  const initializeAudioContext = useCallback(async () => {
    console.log('Initializing audio context');
    try {
      // Clean up previous connections first
      cleanupAudioContext();

      if (!audioContextRef.current) {
        console.log('Creating new AudioContext');
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      if (audioContextRef.current.state === 'suspended') {
        console.log('Resuming suspended AudioContext');
        await audioContextRef.current.resume();
      }

      if (!analyserRef.current) {
        console.log('Creating new AnalyserNode');
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
      }

      // Wait for a short moment to ensure Howl has initialized the audio node
      await new Promise(resolve => setTimeout(resolve, 100));

      if (playerRef.current?.playlist[audioState.currentTrack]?.howl) {
        console.log('Connecting Howler node to analyzer');
        const howl = playerRef.current.playlist[audioState.currentTrack].howl;
        const nodeToConnect = howl._sounds[0]?._node;

        if (nodeToConnect) {
          console.log('Creating and connecting source');
          sourceRef.current = audioContextRef.current.createMediaElementSource(nodeToConnect);
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
        } else {
          console.log('No audio node available yet');
        }
      }
    } catch (error) {
      console.error('Audio context initialization error:', error);
      onError?.(error as Error);
    }
  }, [audioState.currentTrack, onError, cleanupAudioContext]);

  const initializePlayer = useCallback(() => {
    if (!playerRef.current) {
      playerRef.current = new Player(playlist);
    }

    const player = playerRef.current;
    
    player.onPlayCallback = () => {
      setAudioState(prev => ({ ...prev, isPlaying: true }));
      onPlay?.();
    };

    player.onPauseCallback = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false }));
      onPause?.();
    };

    player.onSeekCallback = (seek) => {
      setAudioState(prev => ({ ...prev, currentTime: seek }));
    };

    player.onLoadCallback = () => {
      const sound = player.playlist[player.index].howl;
      if (sound) {
        setAudioState(prev => ({ 
          ...prev, 
          duration: sound.duration(),
          currentTrack: player.index
        }));
        onTrackChange?.(player.index);
      }
    };

    player.onErrorCallback = onError;

    player.onTrackChangeCallback = (index) => {
      setAudioState(prev => ({ ...prev, currentTrack: index }));
      onTrackChange?.(index);
    };

  }, [playlist, onError, onPlay, onPause, onTrackChange]);

  useEffect(() => {
    initializePlayer();
    return () => {
      playerRef.current?.cleanup();
    };
  }, [initializePlayer]);

  // Initialize audio element and event listeners
  useEffect(() => {
    const initOnInteraction = async () => {
      await initializeAudioContext();
      document.removeEventListener('click', initOnInteraction);
    };

    document.addEventListener('click', initOnInteraction);

    return () => {
      document.removeEventListener('click', initOnInteraction);
      if (progressUpdateInterval.current) {
        clearInterval(progressUpdateInterval.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initializeAudioContext]);

  // Add a new effect to reinitialize context when track changes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (showVisualizer) {
      console.log('Track changed, reinitializing audio context');
      // Wait a bit for Howler to initialize the new track
      timeoutId = setTimeout(() => {
        initializeAudioContext();
      }, 200);
    }
  
    return () => {
      clearTimeout(timeoutId);
      cleanupAudioContext();
    };
  }, [audioState.currentTrack, showVisualizer, initializeAudioContext, cleanupAudioContext]);

  const draw = useCallback(() => {
    console.log('Draw function called');
    
    if (!canvasRef.current || !analyserRef.current) {
      console.log('Missing refs:', {
        canvas: !!canvasRef.current,
        analyser: !!analyserRef.current
      });
      return;
    }
  
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) {
      console.log('Failed to get canvas context');
      return;
    }
  
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const drawVisualizer = () => {
      if (!analyserRef.current) {
        console.log('Analyser ref lost during animation');
        return;
      }
      
      animationFrameRef.current = requestAnimationFrame(drawVisualizer);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Log max frequency value to check if we're getting audio data
      const maxValue = Math.max(...Array.from(dataArray));
      if (maxValue > 0) {
        console.log('Receiving audio data, max frequency:', maxValue);
      }
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      const totalWidth = (DEFAULT_CONFIG.barWidth + DEFAULT_CONFIG.barGap) * dataArray.length;
      const scale = canvas.width / totalWidth;
      const scaledBarWidth = DEFAULT_CONFIG.barWidth * scale;
      const scaledGap = DEFAULT_CONFIG.barGap * scale;
      
      let x = 0;
      
      dataArray.forEach((value) => {
        const percentHeight = value / 255;
        const barHeight = Math.max(
          DEFAULT_CONFIG.minHeight,
          percentHeight * DEFAULT_CONFIG.maxHeight
        );
        
        const gradient = context.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, DEFAULT_CONFIG.colors.start);
        gradient.addColorStop(1, DEFAULT_CONFIG.colors.end);
        
        context.fillStyle = gradient;
        context.fillRect(
          x,
          canvas.height - barHeight,
          scaledBarWidth,
          barHeight
        );
        
        x += scaledBarWidth + scaledGap;
      });
    };
  
    drawVisualizer();
  }, []);

  const togglePlay = async () => {
    if (!playerRef.current) return;

    if (audioState.isPlaying) {
      playerRef.current.pause();
    } else {
      await playerRef.current.play();
      if (showVisualizer) {
        await initializeAudioContext();
      }
    }
  };

  const toggleMute = () => {
    if (!playerRef.current?.playlist[playerRef.current.index].howl) return;
    const sound = playerRef.current.playlist[playerRef.current.index].howl;
    sound?.mute(!audioState.isMuted);
    setAudioState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const handleVolumeChange = (newValue: number[]) => {
    if (!playerRef.current?.playlist[playerRef.current.index].howl) return;
    const volumeValue = newValue[0];
    const sound = playerRef.current.playlist[playerRef.current.index].howl;
    sound?.volume(volumeValue);
    setAudioState(prev => ({ ...prev, volume: volumeValue }));
  };

  const handleTimeChange = (newValue: number[]) => {
    if (!playerRef.current) return;
    const timeValue = newValue[0];
    if (isFinite(timeValue)) {
      playerRef.current.seek(timeValue);
      setAudioState(prev => ({ ...prev, currentTime: timeValue }));
    }
  };

  const handleNext = () => {
    playerRef.current?.skip('next');
  };

  const handlePrev = () => {
    playerRef.current?.skip('prev');
  };

  const handleSliderDragStart = () => {
    setIsDragging(true);
  };

  const handleSliderDragEnd = () => {
    setIsDragging(false);
  };

  const toggleLoop = () => {
    if (!playerRef.current) return;
    const isLooping = playerRef.current.toggleLoop();
    setAudioState(prev => ({ ...prev, isLooping }));
  };

  // Add effect to handle cleanup of audio context when dragging ends
  useEffect(() => {
    if (!isDragging && audioState.isPlaying) {
      console.log('Starting visualizer due to play state change');
      draw();
    }
    return () => {
      if (animationFrameRef.current) {
        console.log('Cleaning up animation frame');
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDragging, audioState.isPlaying, draw]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current?.playlist[playerRef.current.index].howl && audioState.isPlaying && !isDragging) {
        const sound = playerRef.current.playlist[playerRef.current.index].howl;
        setAudioState(prev => ({ ...prev, currentTime: sound?.seek() as number || 0 }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [audioState.isPlaying, isDragging]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getNextTrackInfo = () => {
    const nextIndex = (audioState.currentTrack + 1) % playlist.length;
    return playlist[nextIndex];
  };

  return (
    <div className={`w-full ${showVisualizer? "h-full max-h-screen" : "h-fit"}`}>
      <Card 
        className={`
          relative h-full overflow-hidden
          transition-all duration-300 ease-in-out
          bg-muted
          hover:shadow-xl hover:shadow-blue-500/10
          ${isHovering ? 'scale-[1.02]' : 'scale-100'}
        `}
        onMouseLeave={() => setIsVolumeVisible(false)}
      >
        <div className="relative flex flex-col h-full p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
        
            {/* Main content wrapper with height transition */}
          <div className={`
            relative transition-all duration-300 ease-in-out
            ${showVisualizer ? 'flex-1 min-h-[100px]' : 'h-0'}
          `}>
            <div className={`
              absolute inset-0 w-full
              transition-all duration-300 ease-in-out
              ${showVisualizer ? 'opacity-100 visible' : 'opacity-0 invisible h-0'}
            `}>
              <canvas 
                ref={canvasRef}
                className="absolute inset-0 w-full h-full rounded-lg bg-black/20
                          transition-transform duration-300 ease-in-out
                          hover:scale-[1.01]"
              />
              
              {/* Overlay play button */}
              <div className="absolute inset-0 flex items-center justify-center
                            bg-black/40 opacity-0 hover:opacity-100
                            transition-opacity duration-200 rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="h-16 w-16 rounded-full bg-white/10 hover:bg-white/20
                           transition-all duration-200 hover:scale-110"
                >
                  {audioState.isPlaying ? (
                    <PauseCircle className="h-10 w-10 text-white" />
                  ) : (
                    <PlayCircle className="h-10 w-10 text-white" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Controls section */}
          <div className="flex flex-col space-y-2">
            {/* Progress bar */}
            <div className="flex items-center justify-between space-x-4">
              <span className="text-xs sm:text-sm text-gray-400 w-12 text-right">
                {formatTime(audioState.currentTime)}
              </span>
              <div className="relative flex-1 group">
                <Slider
                  value={[audioState.currentTime]}
                  max={audioState.duration}
                  step={0.1}
                  onValueChange={handleTimeChange}
                  onPointerDown={handleSliderDragStart}
                  onPointerUp={handleSliderDragEnd}
                  className="relative z-10"
                />
              </div>
              <span className="text-xs sm:text-sm text-gray-400 w-12">
                {formatTime(audioState.duration)}
              </span>
            </div>

            {/* Playback controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrev}
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:scale-110
                           transition-transform duration-200"
                >
                  <StepBack />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:scale-110
                           transition-transform duration-200"
                >
                  {audioState.isPlaying ? (
                    <PauseCircle className="h-4 w-4 sm:h-6 sm:w-6" />
                  ) : (
                    <PlayCircle className="h-4 w-4 sm:h-6 sm:w-6" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:scale-110
                           transition-transform duration-200"
                >
                  <StepForward />
                </Button>
                {/* <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowVisualizer(!showVisualizer)}
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:scale-110
                           transition-transform duration-200"
                >
                  {showVisualizer ? (
                    <Eye className="h-4 w-4 sm:h-6 sm:w-6" />
                  ) : (
                    <EyeOff className="h-4 w-4 sm:h-6 sm:w-6" />
                  )}
                </Button> */}
                
                
                {/* Current Track Info */}
                <div className="relative group">
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-medium">{playlist[audioState.currentTrack]?.title}</p>
                    <p className="text-xs text-muted-foreground">{playlist[audioState.currentTrack]?.artist}</p>
                  </div>
                  
                  {/* Next Track Info (Hover) */}
                  <div className="absolute right-0 left-full -top-4 mb-2 opacity-0 group-hover:opacity-100
                                transition-opacity duration-200 bg-background/95 backdrop-blur-sm
                                rounded-lg shadow-lg p-2 min-w-[200px] ml-2">
                    <p className="text-xs text-muted-foreground">Up Next</p>
                    <p className="font-medium text-sm">{getNextTrackInfo()?.title}</p>
                    <p className="text-xs text-muted-foreground">{getNextTrackInfo()?.artist}</p>
                  </div>
                </div>
              </div>

              {/* Volume control */}
              <div className="relative"
                onMouseEnter={() => setIsVolumeVisible(true)}
                onMouseLeave={() => setIsVolumeVisible(false)}
              >
                <div className="flex items-center space-x-2">
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="h-8 w-8 rounded-full hover:scale-110
                             transition-transform duration-200"
                  >
                    {audioState.isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <div 
                    className={`
                      transition-all duration-200 ease-in-out
                      ${isVolumeVisible ? 'w-24 opacity-100' : 'w-0 opacity-0'}
                    `}
                  >
                    <Slider
                      value={[audioState.isMuted ? 0 : audioState.volume]}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className={`${isVolumeVisible ? 'visible' : 'invisible'}`}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleLoop}
                    className={`
                      h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:scale-110
                      transition-transform duration-200
                      ${audioState.isLooping ? 'text-primary' : ''}
                    `}
                  >
                    <Repeat className="h-4 w-4 sm:h-6 sm:w-6" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AudioPlayer;