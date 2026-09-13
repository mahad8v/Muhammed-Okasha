import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const TOOLTIP_WIDTH = 52;

interface AudioPlayerControllerProps {
  isPlaying: boolean;
  currentVerseNumber: number;
  currentSurahName: string;
  currentTime: number;
  duration: number;

  canPlayPrevious: boolean;
  canPlayNext: boolean;

  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (seconds: number) => void | Promise<void>;
  onClose?: () => void;

  showCloseButton?: boolean;
  backgroundColor?: string;
  accentColor?: string;
}

const formatTime = (seconds: number): string => {
  'worklet';
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const AudioPlayerController: React.FC<AudioPlayerControllerProps> = ({
  isPlaying,
  currentVerseNumber,
  currentSurahName,
  currentTime,
  duration,
  canPlayPrevious,
  canPlayNext,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onClose,
  showCloseButton = false,
  backgroundColor,
  accentColor,
}) => {
  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme];
  const insets = useSafeAreaInsets();

  const bgColor = backgroundColor || colors.background;
  const accent = accentColor || Colors.dark.secondary;

  const [trackWidth, setTrackWidth] = useState(0);

  // isSeeking (JS state) gates whether the real playback position is
  // allowed to sync into the shared value — while true, the drag gesture
  // owns it exclusively, so the two never fight over the thumb position.
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekLabel, setSeekLabel] = useState('0:00');
  const [seekRatio, setSeekRatio] = useState(0);
  // Set once the native seek call resolves; cleared (and isSeeking turned
  // off) only once `currentTime` actually reflects it. expo-audio's seekTo
  // promise can resolve slightly before the polled status catches up, so
  // clearing isSeeking right away would let the sync effect below fire
  // with the still-stale pre-seek currentTime — visibly snapping the
  // thumb back to the drag-start point before jumping forward again.
  const [pendingSeekTime, setPendingSeekTime] = useState<number | null>(null);

  // Progress in [0, 1]. Read/written on the UI thread so the thumb/fill
  // stay smooth at 60fps regardless of JS-thread load. progressShared is
  // mutated both from the sync effect below and from the pan gesture's
  // worklets — eslint's react-compiler-based "immutability" check doesn't
  // know Reanimated shared values are designed to be written from outside
  // the effect that also writes them, so it's disabled at those call
  // sites; this is the standard, documented Reanimated API.
  const progressShared = useSharedValue(0);
  const isDraggingShared = useSharedValue(false);

  const realProgress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  // Sync the shared value to the real playback position, but only while
  // not actively seeking — this is the "pause the position listener while
  // dragging" behavior, done by simply not overwriting the shared value
  // the drag gesture is currently driving.
  useEffect(() => {
    if (!isSeeking) {
      progressShared.value = withTiming(realProgress, {
        duration: 100,
        easing: Easing.linear,
      });
    }
  }, [realProgress, isSeeking, progressShared]);

  // Resumes the real position listener as soon as currentTime has caught up
  // to the seek target (see pendingSeekTime above). The state update still
  // goes through a (zero-delay) timer rather than running synchronously in
  // the effect body, per the lint rule below — but critically this timer is
  // never re-armed by anything, it either fires almost immediately or not
  // at all for this particular currentTime value.
  useEffect(() => {
    if (pendingSeekTime === null) return undefined;
    if (Math.abs(currentTime - pendingSeekTime) >= 0.75) return undefined;

    const timeout = setTimeout(() => {
      setPendingSeekTime(null);
      setIsSeeking(false);
    }, 0);
    return () => clearTimeout(timeout);
  }, [pendingSeekTime, currentTime]);

  // Hard fallback: if currentTime never lands within the threshold above
  // (e.g. the seek snaps to the nearest keyframe of a compressed audio file
  // instead of the exact target), force-resume after a fixed delay anyway.
  // Deliberately keyed only on pendingSeekTime, NOT currentTime — during
  // playback currentTime changes every ~100ms, and if this timer were
  // re-armed on every tick (as it previously was) it would never survive
  // long enough to fire, permanently freezing the progress bar.
  useEffect(() => {
    if (pendingSeekTime === null) return undefined;
    const timeout = setTimeout(() => {
      setPendingSeekTime(null);
      setIsSeeking(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, [pendingSeekTime]);

  const updateSeekDisplay = (ratio: number) => {
    setSeekRatio(ratio);
    setSeekLabel(formatTime(ratio * duration));
  };

  // Keeps the thumb pinned at the dropped position (isSeeking stays true,
  // so the real-position sync effect stays paused) until the native seek
  // has actually completed AND currentTime reflects it — otherwise the
  // position listener resumes immediately with the still-stale pre-seek
  // currentTime and the thumb (and audible playback) briefly jumps back
  // before catching up.
  const finishSeek = async (ratio: number) => {
    const target = ratio * duration;
    await onSeek(target);
    setPendingSeekTime(target);
  };

  // Recreated each render so it always closes over the latest
  // trackWidth/duration/onSeek.
  const panGesture = Gesture.Pan()
    .onStart((event) => {
      const ratio =
        trackWidth > 0 ? Math.max(0, Math.min(event.x / trackWidth, 1)) : 0;
      isDraggingShared.value = true;
      // eslint-disable-next-line react-hooks/immutability
      progressShared.value = ratio;
      runOnJS(setIsSeeking)(true);
      runOnJS(updateSeekDisplay)(ratio);
    })
    .onUpdate((event) => {
      // Only the visual position and label update per-frame here — the
      // audio engine is never touched until the gesture ends, so dragging
      // never causes playback stutter.
      const ratio =
        trackWidth > 0 ? Math.max(0, Math.min(event.x / trackWidth, 1)) : 0;
      // eslint-disable-next-line react-hooks/immutability
      progressShared.value = ratio;
      runOnJS(updateSeekDisplay)(ratio);
    })
    .onEnd((event) => {
      const ratio =
        trackWidth > 0 ? Math.max(0, Math.min(event.x / trackWidth, 1)) : 0;
      // eslint-disable-next-line react-hooks/immutability
      progressShared.value = ratio;
      isDraggingShared.value = false;
      // The one and only seek() call for the whole gesture. isSeeking is
      // cleared inside finishSeek only once the seek has actually landed.
      runOnJS(finishSeek)(ratio);
    });

  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progressShared.value }],
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: progressShared.value * trackWidth },
      {
        scale: withTiming(isDraggingShared.value ? 1.4 : 1, {
          duration: 120,
        }),
      },
    ],
  }));

  const displayedLabel = isSeeking ? seekLabel : formatTime(currentTime);
  const tooltipRatio = isSeeking ? seekRatio : realProgress;
  const tooltipLeft = Math.max(
    0,
    Math.min(
      tooltipRatio * trackWidth - TOOLTIP_WIDTH / 2,
      Math.max(trackWidth - TOOLTIP_WIDTH, 0),
    ),
  );

  return (
    <>
      {/* Audio Player Bar */}
      <View
        style={[
          styles.audioPlayerContainer,
          { backgroundColor: bgColor, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.topRow}>
          {/* Verse Info */}
          <View style={styles.verseInfo}>
            <Text style={[styles.verseInfoTitle, { color: colors.text }]}>
              Suratul {currentVerseNumber}
            </Text>
            <Text
              style={[styles.verseInfoSubtitle, { color: colors.icon }]}
              numberOfLines={1}
            >
              {currentSurahName}
            </Text>
          </View>

          {showCloseButton && onClose && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={22} color={colors.icon} />
            </TouchableOpacity>
          )}
        </View>

        {/* Progress bar */}
        <View style={styles.progressRow}>
          <Text style={[styles.timeText, { color: colors.icon }]}>
            {displayedLabel}
          </Text>

          <View
            style={styles.progressTrackWrapper}
            onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
          >
            <GestureDetector gesture={panGesture}>
              <View style={styles.gestureArea} hitSlop={{ top: 12, bottom: 12 }}>
                {isSeeking && (
                  <View
                    style={[
                      styles.scrubTooltip,
                      { left: tooltipLeft, backgroundColor: colors.text },
                    ]}
                    pointerEvents="none"
                  >
                    <Text
                      style={[
                        styles.scrubTooltipText,
                        { color: colors.background },
                      ]}
                    >
                      {seekLabel}
                    </Text>
                  </View>
                )}
                <View
                  style={[
                    styles.progressTrack,
                    { backgroundColor: colors.cardBgAlt },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.progressFill,
                      { backgroundColor: accent },
                      fillStyle,
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.progressThumb,
                      { backgroundColor: accent },
                      thumbStyle,
                    ]}
                  />
                </View>
              </View>
            </GestureDetector>
          </View>

          <Text style={[styles.timeText, { color: colors.icon }]}>
            {formatTime(duration)}
          </Text>
        </View>

        {/* Playback Controls */}
        <View style={styles.playbackControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={onPrevious}
            disabled={!canPlayPrevious}
          >
            <Ionicons
              name="play-skip-back"
              size={22}
              color={canPlayPrevious ? accent : colors.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playPauseButton, { backgroundColor: accent }]}
            onPress={onPlayPause}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={28}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={onNext}
            disabled={!canPlayNext}
          >
            <Ionicons
              name="play-skip-forward"
              size={22}
              color={canPlayNext ? accent : colors.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default AudioPlayerController;

const styles = StyleSheet.create({
  audioPlayerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verseInfo: {
    flex: 1,
    marginRight: 16,
  },
  verseInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  verseInfoSubtitle: {
    fontSize: 13,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  timeText: {
    fontSize: 11,
    fontVariant: ['tabular-nums'],
    minWidth: 32,
  },
  progressTrackWrapper: {
    flex: 1,
    paddingVertical: 10,
  },
  gestureArea: {
    width: '100%',
  },
  scrubTooltip: {
    position: 'absolute',
    top: -28,
    width: 52,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  scrubTooltipText: {
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'visible',
  },
  progressFill: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    transformOrigin: 'left',
  },
  progressThumb: {
    position: 'absolute',
    left: 0,
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: -6,
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 10,
  },
  controlButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
