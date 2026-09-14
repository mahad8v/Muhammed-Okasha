// contexts/AudioPlayerContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { Alert } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { getLocalSurahUri } from '@/services/offlineAudio';

/**
 * Resolves the audio URL for a given surah id. Supplied by whichever screen
 * calls playSurah (e.g. a reciter's or a tafsir scholar's own lookup), so
 * this context stays agnostic to what kind of audio it's playing.
 */
type ResolveAudioUrl = (surahId: number) => string;

interface AudioPlayerContextType {
  isPlaying: boolean;
  currentSurahId: number | null;
  currentSurahName: string;
  /** Id of whichever reciter/tafsir scholar/etc. is currently loaded. */
  currentReciterId: string | null;
  currentTime: number;
  duration: number;
  canPlayPrevious: boolean;
  canPlayNext: boolean;
  playSurah: (
    surahId: number,
    surahName: string,
    sourceId: string,
    resolveUrl: ResolveAudioUrl,
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
  // Remembered so playNext/playPrevious can resolve the adjacent surah's
  // URL the same way the original playSurah call did.
  const resolveUrlRef = useRef<ResolveAudioUrl | null>(null);
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
    sourceId: string,
    resolveUrl: ResolveAudioUrl,
  ) => {
    try {
      resolveUrlRef.current = resolveUrl;
      const localUri = getLocalSurahUri(sourceId, surahId);
      const audioUrl = localUri ?? resolveUrl(surahId);

      if (!audioUrl) {
        console.error(`No audio URL found for Surah ${surahId}`);
        return;
      }

      // If the same surah/source is already loaded, just toggle play/pause
      if (currentSurahId === surahId && currentReciterId === sourceId) {
        togglePlayPause();
        return;
      }

      // Load and play new surah
      await player.replace({ uri: audioUrl });
      player.play();
      setCurrentSurahId(surahId);
      setCurrentSurahName(surahName);
      setCurrentReciterId(sourceId);
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
    if (
      currentSurahId &&
      currentSurahId < totalSurahs &&
      currentReciterId &&
      resolveUrlRef.current
    ) {
      // You'll need to get the next surah name from your data
      const nextId = currentSurahId + 1;
      playSurah(nextId, `Surah ${nextId}`, currentReciterId, resolveUrlRef.current);
    }
  };

  const playPrevious = () => {
    if (
      currentSurahId &&
      currentSurahId > 1 &&
      currentReciterId &&
      resolveUrlRef.current
    ) {
      // You'll need to get the previous surah name from your data
      const prevId = currentSurahId - 1;
      playSurah(prevId, `Surah ${prevId}`, currentReciterId, resolveUrlRef.current);
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
