// types.ts

export interface PlaylistItem {
  title: string;
  file: string;
  howl: Howl | null;
  artist?: string;
  duration?: number;
  artwork?: string;
}

export interface AudioPlayerProps {
  playlist: PlaylistItem[];
  onError?: (error: Error) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onTrackChange?: (index: number) => void;
}

export interface AudioState {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  isMuted: boolean;
  volume: number;
  currentTrack: number;
  playlist: PlaylistItem[];
  isLooping: boolean;
}

export interface VisualizerConfig {
  barWidth: number;
  barGap: number;
  minHeight: number;
  maxHeight: number;
  colors: {
    start: string;
    end: string;
  };
}