import { Howl } from 'howler';
import type { PlaylistItem } from './types/audio.player';

export class Player {
  playlist: PlaylistItem[];
  index: number;
  onPlayCallback?: () => void;
  onPauseCallback?: () => void;
  onSeekCallback?: (seek: number) => void;
  onEndCallback?: () => void;
  onLoadCallback?: () => void;
  onErrorCallback?: (error: Error) => void;
  onTrackChangeCallback?: (index: number) => void;
  isLooping: boolean;

  constructor(playlist: PlaylistItem[]) {
    this.playlist = playlist;
    this.index = 0;
    this.isLooping = false;
  }

  play(index?: number) {
    let sound: Howl;

    index = typeof index === 'number' ? index : this.index;
    const data = this.playlist[index];

    if (data.howl) {
      sound = data.howl;
    } else {
      sound = data.howl = new Howl({
        src: [data.file],
        html5: true,
        onplay: () => this.onPlayCallback?.(),
        onload: () => this.onLoadCallback?.(),
        onend: () => {
          this.onEndCallback?.();
          if (!this.isLooping) {
            this.skip('next');
          }
        },
        onpause: () => this.onPauseCallback?.(),
        onseek: () => this.onSeekCallback?.(sound.seek() as number),
        onstop: () => this.onPauseCallback?.(),
        onloaderror: (_, error) =>
          this.onErrorCallback?.(new Error(String(error))),
        loop: this.isLooping,
      });
    }

    sound.play();
    this.index = index;
    this.onTrackChangeCallback?.(index);

    return sound;
  }

  pause() {
    const sound = this.playlist[this.index].howl;
    if (sound) {
      sound.pause();
    }
  }

  skip(direction: 'next' | 'prev') {
    let index = this.index;

    if (direction === 'prev') {
      index = index - 1;
      if (index < 0) {
        index = this.playlist.length - 1;
      }
    } else {
      index = index + 1;
      if (index >= this.playlist.length) {
        index = 0;
      }
    }

    this.skipTo(index);
    this.onTrackChangeCallback?.(index);
  }

  skipTo(index: number) {
    if (this.playlist[this.index].howl) {
      this.playlist[this.index].howl?.stop();
    }

    this.onTrackChangeCallback?.(index);
    return this.play(index);
  }

  seek(time: number) {
    const sound = this.playlist[this.index].howl;
    if (sound) {
      sound.seek(time);
    }
  }

  cleanup() {
    this.playlist.forEach(item => {
      if (item.howl) {
        item.howl.unload();
      }
    });
  }

  toggleLoop(): boolean {
    this.isLooping = !this.isLooping;
    const sound = this.playlist[this.index].howl;
    if (sound) {
      sound.loop(this.isLooping);
    }
    return this.isLooping;
  }
}
