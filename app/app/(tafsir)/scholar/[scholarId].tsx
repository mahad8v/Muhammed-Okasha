import AudioPlayerController from '@/app/(quran)/components/AudioController';
import { Shimmer } from '@/components/ui/Shimmer';
import { Colors } from '@/constants/theme';
import { useAudioPlayerContext } from '@/context/AudioContext';
import {
  deleteDownloadedSurah,
  downloadSurah,
  isSurahDownloaded,
} from '@/services/offlineAudio';
import { getChapters } from '@/services/quranApi';
import {
  fetchTafsirScholars,
  getTafsirScholarSurahAudioUrl,
  isSurahAvailableForTafsirScholar,
} from '@/services/tafsirs';
import { Surah } from '@/types/quranTypes';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TafsirScholarSurahsScreen = () => {
  const { scholarId } = useLocalSearchParams<{ scholarId: string }>();

  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme];

  const { data: scholars, isLoading: isLoadingScholars } = useQuery({
    queryKey: ['tafsirScholars'],
    queryFn: fetchTafsirScholars,
    staleTime: 5 * 60 * 1000,
  });
  const scholar = scholars?.find((s) => s.id === scholarId);

  const {
    data: surahs,
    isLoading: isLoadingSurahs,
    isError,
    error,
  } = useQuery<Surah[]>({
    queryKey: ['chapters'],
    queryFn: () => getChapters(),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const isLoading = isLoadingScholars || isLoadingSurahs;

  const {
    isPlaying,
    currentSurahId,
    currentReciterId: currentSourceId,
    currentSurahName,
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
  } = useAudioPlayerContext();

  const isThisScholarPlaying = currentSourceId === scholarId;

  const [downloadVersion, setDownloadVersion] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState<
    Record<number, number>
  >({});

  // Deletions can also happen from the standalone Downloads screen, so
  // re-scan the filesystem whenever this screen regains focus, not just
  // after downloads/deletes made directly here.
  useFocusEffect(
    useCallback(() => {
      setDownloadVersion((version) => version + 1);
    }, []),
  );

  const downloadedIds = useMemo(() => {
    if (!scholar || !surahs) return new Set<number>();

    return new Set(
      surahs
        .filter((surah) => isSurahDownloaded(scholar.id, surah.id))
        .map((surah) => surah.id),
    );
    // downloadVersion is a manual invalidation trigger: downloads/deletes
    // change files on disk directly, outside of React's data flow.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scholar, surahs, downloadVersion]);

  const handleDownload = async (surah: Surah) => {
    if (!scholar || downloadProgress[surah.id] !== undefined) return;

    setDownloadProgress((prev) => ({ ...prev, [surah.id]: 0 }));
    try {
      const remoteUrl = getTafsirScholarSurahAudioUrl(scholar, surah.id);
      await downloadSurah(scholar.id, surah.id, remoteUrl, (fraction) => {
        setDownloadProgress((prev) => ({ ...prev, [surah.id]: fraction }));
      });
      setDownloadVersion((version) => version + 1);
    } catch (err) {
      console.error('Failed to download tafsir:', err);
    } finally {
      setDownloadProgress((prev) => {
        const next = { ...prev };
        delete next[surah.id];
        return next;
      });
    }
  };

  const handleRemoveDownload = (surah: Surah) => {
    if (!scholar) return;
    deleteDownloadedSurah(scholar.id, surah.id);
    setDownloadVersion((version) => version + 1);
  };

  const handleSurahPress = (surah: Surah) => {
    if (!scholar || !isSurahAvailableForTafsirScholar(scholar, surah.id)) {
      return;
    }
    playSurah(surah.id, surah.name_complex, scholar.id, (id) =>
      getTafsirScholarSurahAudioUrl(scholar, id),
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView
        edges={['top']}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.surahList}>
          {Array.from({ length: 10 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.surahItem,
                {
                  borderBottomColor:
                    scheme === 'dark' ? colors.cardBgAlt : '#F0F0F0',
                },
              ]}
            >
              <View style={styles.surahLeft}>
                <Shimmer width={40} height={40} borderRadius={20} />
                <View style={[styles.surahInfo, { marginLeft: 16, gap: 6 }]}>
                  <Shimmer width="60%" height={14} />
                  <Shimmer width="40%" height={12} />
                </View>
              </View>
              <Shimmer width={40} height={16} />
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (!scholar) {
    return (
      <SafeAreaView
        edges={['top']}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.centerContainer}>
          <Text style={{ color: colors.text }}>Scholar not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView
        edges={['top']}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.centerContainer}>
          <Text style={{ color: colors.text }}>
            Error loading surahs: {error?.message}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: isThisScholarPlaying && currentSurahId ? 100 : 20,
        }}
      >
        <View style={styles.surahList}>
          {surahs?.map((surah) => {
            const available = isSurahAvailableForTafsirScholar(
              scholar,
              surah.id,
            );
            const isCurrent =
              isThisScholarPlaying && currentSurahId === surah.id;

            return (
              <TouchableOpacity
                key={surah.id}
                disabled={!available}
                onPress={() => handleSurahPress(surah)}
                style={[
                  styles.surahItem,
                  {
                    borderBottomColor:
                      scheme === 'dark' ? colors.cardBgAlt : '#F0F0F0',
                    backgroundColor: isCurrent
                      ? scheme === 'dark'
                        ? 'rgba(166, 124, 82, 0.1)'
                        : 'rgba(166, 124, 82, 0.05)'
                      : 'transparent',
                    opacity: available ? 1 : 0.5,
                  },
                ]}
              >
                <View style={styles.surahLeft}>
                  <View
                    style={[
                      styles.surahNumberContainer,
                      {
                        borderColor: isCurrent
                          ? Colors.dark.secondary
                          : scheme === 'dark'
                            ? colors.cardBgAlt
                            : '#E0E0E0',
                        backgroundColor: isCurrent
                          ? Colors.dark.secondary
                          : 'transparent',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.surahNumber,
                        {
                          color: isCurrent ? '#FFFFFF' : Colors.dark.secondary,
                        },
                      ]}
                    >
                      {surah.id}
                    </Text>
                  </View>
                  <View style={styles.surahInfo}>
                    <Text style={[styles.surahName, { color: colors.text }]}>
                      {surah.name_complex}
                    </Text>
                    <Text style={[styles.surahDetails, { color: '#A67C52' }]}>
                      {available
                        ? `${surah.verses_count} verses | ${surah.revelation_place}`
                        : 'Coming soon'}
                    </Text>
                  </View>
                </View>

                <View style={styles.surahRight}>
                  <Text style={[styles.surahArabic, { color: colors.text }]}>
                    {surah.name_arabic}
                  </Text>

                  {available && (
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() =>
                        downloadedIds.has(surah.id)
                          ? handleRemoveDownload(surah)
                          : handleDownload(surah)
                      }
                    >
                      {downloadProgress[surah.id] !== undefined ? (
                        <ActivityIndicator
                          size="small"
                          color={Colors.dark.secondary}
                        />
                      ) : downloadedIds.has(surah.id) ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={Colors.dark.secondary}
                        />
                      ) : (
                        <Ionicons
                          name="download-outline"
                          size={20}
                          color={colors.icon}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {isThisScholarPlaying && currentSurahId && (
        <AudioPlayerController
          isPlaying={isPlaying}
          currentVerseNumber={currentSurahId}
          currentSurahName={currentSurahName}
          currentTime={currentTime}
          duration={duration}
          canPlayPrevious={canPlayPrevious}
          canPlayNext={canPlayNext}
          onPlayPause={togglePlayPause}
          onNext={playNext}
          onPrevious={playPrevious}
          onSeek={seekTo}
          onClose={stopPlayback}
          showCloseButton={true}
        />
      )}
    </SafeAreaView>
  );
};

export default TafsirScholarSurahsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  surahList: {
    paddingHorizontal: 20,
  },
  surahItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  surahLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  surahNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  surahNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  surahDetails: {
    fontSize: 12,
  },
  surahArabic: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
  },
  surahRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  downloadButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
