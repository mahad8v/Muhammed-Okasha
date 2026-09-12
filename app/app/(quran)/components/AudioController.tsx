import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface AudioPlayerControllerProps {
  isPlaying: boolean;
  currentVerseNumber: number;
  currentSurahName: string;

  canPlayPrevious: boolean;
  canPlayNext: boolean;

  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onClose?: () => void;

  showCloseButton?: boolean;
  backgroundColor?: string;
  accentColor?: string;
}

const AudioPlayerController: React.FC<AudioPlayerControllerProps> = ({
  isPlaying,
  currentVerseNumber,
  currentSurahName,
  canPlayPrevious,
  canPlayNext,
  onPlayPause,
  onNext,
  onPrevious,
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

  return (
    <>
      {/* Audio Player Bar */}
      <View
        style={[
          styles.audioPlayerContainer,
          { backgroundColor: bgColor, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.audioPlayerContent}>
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

          {/* Playback Controls */}
          <View style={styles.playbackControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={onPrevious}
              disabled={!canPlayPrevious}
            >
              <Ionicons
                name="play-skip-back"
                size={24}
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
                size={24}
                color={canPlayNext ? accent : colors.icon}
              />
            </TouchableOpacity>

            {/* Optional Close Button */}
            {showCloseButton && onClose && (
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color={colors.icon} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

export default AudioPlayerController;

const styles = StyleSheet.create({
  fadeGradient: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    height: 80,
  },
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
  },
  audioPlayerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
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
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 40,
    height: 40,
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
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
