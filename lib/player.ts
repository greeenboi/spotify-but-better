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

  constructor(playlist: PlaylistItem[]) {
    this.playlist = playlist;
    this.index = 0;
  }

  play(index?: number) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    let sound: Howl;

    index = typeof index === 'number' ? index : self.index;
    const data = self.playlist[index];

    if (data.howl) {
      sound = data.howl;
    } else {
      sound = data.howl = new Howl({
        src: [data.file],
        html5: true,
        onplay: () => self.onPlayCallback?.(),
        onload: () => self.onLoadCallback?.(),
        onend: () => {
          self.onEndCallback?.();
          self.skip('next');
        },
        onpause: () => self.onPauseCallback?.(),
        onseek: () => self.onSeekCallback?.(sound.seek() as number),
        onstop: () => self.onPauseCallback?.(),
        onloaderror: (_, error) => self.onErrorCallback?.(new Error(String(error)))
      });
    }

    sound.play();
    self.index = index;

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
  }

  skipTo(index: number) {
    if (this.playlist[this.index].howl) {
      this.playlist[this.index].howl?.stop();
    }

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
}