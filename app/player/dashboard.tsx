import React from 'react';
import { Play } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import AudioPlayer from '@/components/music-player';
import type { PlaylistItem } from '@/lib/types/audio.player';

const samplePlaylist: PlaylistItem[] = [
  {
    title: 'A Game Not Worth Winning',
    file: '/music/A Game Not Worth Winning - At Dawn We Rage.mp3',
    artist: 'At Dawn We Rage',
    howl: null,
  },
  {
    title: 'After Dark',
    file: '/music/After Dark - Essenger.mp3',
    artist: 'Essenger',
    howl: null,
  },
  {
    title: 'Days of Thunder',
    file: '/music/Days of Thunder - The Midnight.mp3',
    artist: 'The Midnight',
    howl: null,
  },
  {
    title: '23',
    file: '/music/23 - Diamond Eyes.mp3',
    artist: 'Diamond Eyes',
    howl: null,
  },
  {
    title: 'Jaded',
    file: '/music/Jaded - yitaku.mp3',
    artist: 'yitaku',
    howl: null,
  },
];

export default function Dashboard() {
  const handleError = (error: Error) => {
    console.error('Audio player error:', error);
  };
  return (
    <div className="h-screen flex flex-col bg-black text-white relative ">
      {/* Main content */}
      <main className="flex-1 overflow-hidden pb-36">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Your Music</h1>

            <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-all group"
                >
                  <Image
                    width="160"
                    height="160"
                    src={`/placeholder.png`}
                    alt="Album cover"
                    className="w-full mb-4 rounded-md"
                  />
                  <h3 className="font-semibold mb-1 truncate">Album {i + 1}</h3>
                  <p className="text-sm text-gray-400 truncate">
                    Artist {i + 1}
                  </p>
                  <button className="mt-2 bg-green-500 text-black rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-4">Made For You</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-all group"
                >
                  <Image
                    width="160"
                    height="160"
                    src={`/placeholder.png`}
                    alt="Playlist cover"
                    className="w-full mb-4 rounded-md"
                  />
                  <h3 className="font-semibold mb-1 truncate">
                    Daily Mix {i + 1}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">
                    Your daily music mix
                  </p>
                  <button className="mt-2 bg-green-500 text-black rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-4">Top Playlists</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded flex items-center overflow-hidden hover:bg-gray-700 transition-all group"
                >
                  <Image
                    width="160"
                    height="160"
                    src={`/placeholder.svg?height=80&width=80`}
                    alt="Playlist cover"
                    className="h-20 w-20"
                  />
                  <span className="font-semibold px-4 truncate">
                    Top Playlist {i + 1}
                  </span>
                  <button className="ml-auto mr-4 bg-green-500 rounded-full p-3 text-black opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </main>

      <AudioPlayer
        playlist={samplePlaylist}
        onError={handleError}
        onPlay={() => console.log('Playing')}
        onPause={() => console.log('Paused')}
      />
    </div>
  );
}
