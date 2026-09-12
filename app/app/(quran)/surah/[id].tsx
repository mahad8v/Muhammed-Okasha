import { Colors } from '@/constants/theme';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import PlayIcon from '@/components/icons/playIcon';
import Card from '@/components/card';
import { Shimmer } from '@/components/ui/Shimmer';
import { getVerses } from '@/services/quranApi';
import { useAudioPlayer } from 'expo-audio';
import AsrIcon from '@/components/icons/AsrIcon';

const SurahDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme];

  const surah = {
    number: params.number,
    name: params.name || 'An-Nisa',
    arabic: params.arabic || 'النساء',
    verses: params.verses || '176 Verses',
    revelation: params.revelation,
  };

  // State to track which verse is currently playing
  const [playingVerseId, setPlayingVerseId] = useState<number | null>(null);

  const {
    data: verses,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['verses', surah.number],
    queryFn: () => getVerses(Number(surah.number)),
    enabled: !!surah.number,
  });

  const player = useAudioPlayer();

  const playAudio = async (audioUrl: string, verseId: number) => {
    try {
      if (!audioUrl) return;

      // If same verse is playing, toggle pause/play
      if (playingVerseId === verseId) {
        if (player.playing) {
          player.pause();
        } else {
          player.play();
        }
        return;
      }

      // Play new verse
      player.replace({ uri: audioUrl });
      player.play();
      setPlayingVerseId(verseId);
    } catch (error) {
      console.log('Audio error:', error);
    }
  };

  // Reset playing state when audio ends
  // useEffect(() => {
  //   if (!player.playing && playingVerseId !== null) {
  //     // Small delay to check if it actually ended vs just paused
  //     const timeout = setTimeout(() => {
  //       if (!player.playing) {
  //         setPlayingVerseId(null);
  //       }
  //     }, 100);

  //     return () => clearTimeout(timeout);
  //   }
  // }, [player.playing, playingVerseId]);

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView
        edges={['top']}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <View style={styles.verseHeader}>
                <Shimmer width={32} height={32} borderRadius={16} />
              </View>
              <View style={{ gap: 10, marginTop: 8 }}>
                <Shimmer width="90%" height={18} />
                <Shimmer width="70%" height={18} />
                <Shimmer width="50%" height={14} />
              </View>
            </Card>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Error state
  if (isError) {
    return (
      <SafeAreaView
        edges={['top']}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Failed to load verses
          </Text>
          <Text style={[styles.errorSubText, { color: colors.icon }]}>
            {error?.message || 'Unknown error'}
          </Text>
          <TouchableOpacity
            style={[
              styles.retryButton,
              { backgroundColor: Colors.dark.secondary },
            ]}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Surah Title */}
        {/* <View style={styles.titleSection}>
          <Text style={[styles.surahTitle, { color: colors.text }]}>
            {surah.name}
          </Text>
          <Text style={[styles.verseCount, { color: colors.icon }]}>
            {surah.verses}
          </Text>
        </View> */}

        {/* Bismillah - Hide for Surah 9 (At-Tawbah) */}
        {Number(surah.number) !== 9 && (
          <View style={styles.bismillahContainer}>
            <Text style={[styles.bismillah, { color: colors.text }]}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </Text>
          </View>
        )}

        {/* Verses */}
        {verses?.map((verse: any) => (
          <Card key={verse.id}>
            <View style={styles.verseHeader}>
              <View
                style={[
                  styles.verseNumberBadge,
                  { borderColor: Colors.dark.secondary },
                ]}
              >
                <Text
                  style={[
                    styles.verseNumberIcon,
                    { color: Colors.dark.secondary },
                  ]}
                >
                  {verse.verse_number}
                </Text>
              </View>

              <View style={styles.verseActions}>
                {/* <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => playAudio(verse.audio, verse.id)}
                >
                  {playingVerseId === verse.id && player.playing ? (
                    <AsrIcon
                      width={30}
                      height={30}
                      color={Colors.dark.secondary}
                    />
                  ) : (
                    <PlayIcon
                      width={30}
                      height={30}
                      color={Colors.dark.secondary}
                    />
                  )}
                </TouchableOpacity> */}
              </View>
            </View>

            {/* Arabic Text */}
            <Text style={[styles.arabicText, { color: colors.text }]}>
              {verse.text_uthmani || verse.text}
            </Text>

            {/* Translation */}
            <Text style={[styles.translationText, { color: colors.icon }]}>
              {verse.translations?.[0]?.text || 'Translation not available'}
            </Text>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SurahDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'blue',
  },
  scrollView: {
    flex: 1,
    // backgroundColor: 'blue',
  },
  scrollContent: {
    // backgroundColor : 'red',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
    // backgroundColor: 'red',
  },
  surahTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  verseCount: {
    fontSize: 14,
  },
  bismillahContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 20,
    // marginBottom: 20,
  },
  bismillah: {
    fontSize: 21,
    fontWeight: '600',
    textAlign: 'center',
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  verseNumberBadge: {
    width: 30,
    height: 30,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseNumberIcon: {
    fontSize: 14,
  },
  verseActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arabicText: {
    fontSize: 20,
    lineHeight: 42,
    textAlign: 'right',
    marginBottom: 16,
    fontWeight: '500',
  },
  translationText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
});
