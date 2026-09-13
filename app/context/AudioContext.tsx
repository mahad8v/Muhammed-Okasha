// contexts/AudioPlayerContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
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
  currentTime: number;
  duration: number;
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
  seekTo: (seconds: number) => Promise<void>;
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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Update playing state when player state changes
  useEffect(() => {
    setIsPlaying(player.playing);
  }, [player.playing]);

  // expo-audio's event-driven status updates (useAudioPlayerStatus) stop
  // arriving after a manual seekTo() call made mid-playback and only resume
  // once play()/pause() is called again — leaving the progress bar and
  // timer frozen at the seeked-to position even though audio keeps playing.
  // Polling the player's own currentTime/duration properties directly
  // sidesteps that native event gap entirely.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(player.currentTime);
      setDuration(player.duration);
    }, 100);
    return () => clearInterval(interval);
  }, [player]);

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
      // playSurah previously failed silently — tapping play would just do
      // nothing with no indication why, which is exactly what made a real
      // playback failure indistinguishable from "the app didn't respond".
      Alert.alert(
        'Couldn\'t play this surah',
        error instanceof Error ? error.message : String(error),
      );
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

  const seekTo = async (seconds: number) => {
    const clamped = Math.max(0, Math.min(seconds, player.duration || 0));
    // Awaited so callers (the scrubber) can hold the dragged-to position
    // on screen until the native seek has actually landed, instead of
    // resuming the real position listener while it's still mid-flight and
    // briefly snapping back to the pre-seek time.
    await player.seekTo(clamped);
    // Reflect the new position immediately rather than waiting for the
    // next poll tick.
    setCurrentTime(player.currentTime);
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
        currentTime,
        duration,
        canPlayPrevious,
        canPlayNext,
        playSurah,
        togglePlayPause,
        playNext,
        playPrevious,
        stopPlayback,
        seekTo,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
