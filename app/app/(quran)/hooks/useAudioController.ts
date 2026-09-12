import { useState, useEffect } from 'react';
import { useAudioPlayer } from 'expo-audio';

export interface AudioItem {
  id: number;
  audio: string;
  verse_number: number;
  [key: string]: any;
}

interface UseAudioControllerOptions {
  items: AudioItem[] | undefined;
  autoPlayNext?: boolean;
  onTrackEnd?: () => void;
  onTrackChange?: (item: AudioItem) => void;
}

export const useAudioController = ({
  items,
  autoPlayNext = true,
  onTrackEnd,
  onTrackChange,
}: UseAudioControllerOptions) => {
  const player = useAudioPlayer();
  const [playingItemId, setPlayingItemId] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Play audio for a specific item
  const playAudio = async (audioUrl: string, itemId: number) => {
    try {
      if (!audioUrl) return;

      const itemIndex = items?.findIndex((item) => item.id === itemId) ?? 0;

      // If clicking the same item, just toggle play/pause
      if (playingItemId === itemId) {
        if (player.playing) {
          player.pause();
        } else {
          player.play();
        }
        return;
      }

      // Play new item
      player.replace({ uri: audioUrl });
      player.play();
      setPlayingItemId(itemId);
      setCurrentIndex(itemIndex);

      // Call callback if provided
      if (onTrackChange && items) {
        onTrackChange(items[itemIndex]);
      }
    } catch (error) {
      console.log('Audio error:', error);
    }
  };

  // Play next item
  const playNext = () => {
    if (!items || items.length === 0) return;

    const nextIndex = currentIndex + 1;
    if (nextIndex < items.length) {
      const nextItem = items[nextIndex];
      playAudio(nextItem.audio, nextItem.id);
    }
  };

  // Play previous item
  const playPrevious = () => {
    if (!items || items.length === 0) return;

    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      const prevItem = items[prevIndex];
      playAudio(prevItem.audio, prevItem.id);
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (playingItemId !== null) {
      if (player.playing) {
        player.pause();
      } else {
        player.play();
      }
    }
  };

  // Stop playback and reset
  const stop = () => {
    player.pause();
    setPlayingItemId(null);
    setCurrentIndex(0);
  };

  // Handle track end
  useEffect(() => {
    if (!player.playing && playingItemId !== null) {
      const timeout = setTimeout(() => {
        if (!player.playing) {
          // Track ended
          if (onTrackEnd) {
            onTrackEnd();
          }

          // Auto-play next if enabled
          if (autoPlayNext && items && currentIndex < items.length - 1) {
            playNext();
          } else {
            // Reset if it was the last track
            setPlayingItemId(null);
          }
        }
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [player.playing, playingItemId, currentIndex]);

  // Get current playing item
  const currentItem = items?.find((item) => item.id === playingItemId);

  // Check if can navigate
  const canPlayPrevious = currentIndex > 0;
  const canPlayNext = items ? currentIndex < items.length - 1 : false;

  return {
    // State
    playingItemId,
    currentIndex,
    currentItem,
    isPlaying: player.playing,

    // Navigation state
    canPlayPrevious,
    canPlayNext,

    // Controls
    playAudio,
    playNext,
    playPrevious,
    togglePlayPause,
    stop,

    // Player instance (in case direct access is needed)
    player,
  };
};
