// contexts/AudioPlayerContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { useQuery } from '@tanstack/react-query';
import { getSurahAudioUrl } from '@/services/audioService';
import { fetchReciters, getReciterSurahAudioUrl } from '@/services/reciters';
import { getLocalSurahUri } from '@/services/offlineAudio';

interface AudioPlayerContextType {
  isPlaying: boolean;
  currentSurahId: number | null;
  currentSurahName: string;
  currentReciterId: string | null;
  canPlayPrevious: boolean;
  canPlayNext: boolean;
  playSurah: (
    surahId: number,
    surahName: string,
    reciterId?: string,
  ) => Promise<void>;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  stopPlayback: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined,
);

export const useAudioPlayerContext = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error(
      'useAudioPlayerContext must be used within AudioPlayerProvider',
    );
  }
  return context;
};

interface AudioPlayerProviderProps {
  children: React.ReactNode;
  totalSurahs?: number;
}

export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({
  children,
  totalSurahs = 114,
}) => {
  const player = useAudioPlayer();
  const { data: reciters } = useQuery({
    queryKey: ['reciters'],
    queryFn: fetchReciters,
    staleTime: 5 * 60 * 1000,
  });
  const [currentSurahId, setCurrentSurahId] = useState<number | null>(null);
  const [currentSurahName, setCurrentSurahName] = useState<string>('');
  const [currentReciterId, setCurrentReciterId] = useState<string | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState(false);

  // Update playing state when player state changes
  useEffect(() => {
    setIsPlaying(player.playing);
  }, [player.playing]);

  const playSurah = async (
    surahId: number,
    surahName: string,
    reciterId?: string,
  ) => {
    try {
      const reciter = reciterId
        ? reciters?.find((r) => r.id === reciterId)
        : undefined;
      const localUri = reciterId
        ? getLocalSurahUri(reciterId, surahId)
        : null;
      const audioUrl =
        localUri ??
        (reciter
          ? getReciterSurahAudioUrl(reciter, surahId)
          : getSurahAudioUrl(surahId));

      if (!audioUrl) {
        console.error(`No audio URL found for Surah ${surahId}`);
        return;
      }

      // If the same surah/reciter is already loaded, just toggle play/pause
      if (currentSurahId === surahId && currentReciterId === (reciterId ?? null)) {
        togglePlayPause();
        return;
      }

      // Load and play new surah
      await player.replace({ uri: audioUrl });
      player.play();
      setCurrentSurahId(surahId);
      setCurrentSurahName(surahName);
      setCurrentReciterId(reciterId ?? null);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing surah:', error);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (player.playing) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    if (currentSurahId && currentSurahId < totalSurahs) {
      // You'll need to get the next surah name from your data
      playSurah(
        currentSurahId + 1,
        `Surah ${currentSurahId + 1}`,
        currentReciterId ?? undefined,
      );
    }
  };

  const playPrevious = () => {
    if (currentSurahId && currentSurahId > 1) {
      // You'll need to get the previous surah name from your data
      playSurah(
        currentSurahId - 1,
        `Surah ${currentSurahId - 1}`,
        currentReciterId ?? undefined,
      );
    }
  };

  const stopPlayback = () => {
    player.pause();
    setIsPlaying(false);
    setCurrentSurahId(null);
    setCurrentSurahName('');
    setCurrentReciterId(null);
  };

  const canPlayPrevious = currentSurahId !== null && currentSurahId > 1;
  const canPlayNext = currentSurahId !== null && currentSurahId < totalSurahs;

  return (
    <AudioPlayerContext.Provider
      value={{
        isPlaying,
        currentSurahId,
        currentSurahName,
        currentReciterId,
        canPlayPrevious,
        canPlayNext,
        playSurah,
        togglePlayPause,
        playNext,
        playPrevious,
        stopPlayback,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
