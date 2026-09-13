import { Colors } from '@/constants/theme';
import { getChapters } from '@/services/quranApi';
import { fetchReciters } from '@/services/reciters';
import {
  deleteAllDownloads,
  deleteAllDownloadsForReciter,
  deleteDownloadedSurah,
  listDownloadedReciterIds,
  listDownloadedSurahIds,
} from '@/services/offlineAudio';
import { Surah } from '@/types/quranTypes';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DownloadsScreen = () => {
  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme];

  const { data: reciters } = useQuery({
    queryKey: ['reciters'],
    queryFn: fetchReciters,
    staleTime: 5 * 60 * 1000,
  });
  const { data: surahs } = useQuery<Surah[]>({
    queryKey: ['chapters'],
    queryFn: getChapters,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Downloaded files live on disk, outside React Query/state — this counter
  // is bumped after every delete to force the list below to re-read them.
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  // Deletions can also happen from the reciter screen, so re-scan whenever
  // this screen regains focus, not just after our own delete actions.
  useFocusEffect(refresh);

  const downloads = useMemo(() => {
    return listDownloadedReciterIds()
      .map((reciterId) => ({
        reciterId,
        surahIds: listDownloadedSurahIds(reciterId),
      }))
      .filter((entry) => entry.surahIds.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  const getReciterName = (reciterId: string) =>
    reciters?.find((r) => r.id === reciterId)?.name ?? reciterId;

  const getSurahName = (surahId: number) =>
    surahs?.find((s) => s.id === surahId)?.name_complex ?? `Surah ${surahId}`;

  const handleDeleteSurah = (reciterId: string, surahId: number) => {
    deleteDownloadedSurah(reciterId, surahId);
    refresh();
  };

  const handleDeleteReciter = (reciterId: string) => {
    Alert.alert(
      'Delete all downloads',
      `Remove every downloaded surah for ${getReciterName(reciterId)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteAllDownloadsForReciter(reciterId);
            refresh();
          },
        },
      ],
    );
  };

  const handleDeleteAll = () => {
    Alert.alert(
      'Delete all downloads',
      'Remove every downloaded surah for every reciter?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => {
            deleteAllDownloads();
            refresh();
          },
        },
      ],
    );
  };

  const hasDownloads = downloads.length > 0;

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!hasDownloads && (
          <View style={styles.emptyState}>
            <Ionicons
              name="download-outline"
              size={40}
              color={colors.icon}
            />
            <Text style={[styles.emptyText, { color: colors.icon }]}>
              No downloaded surahs yet
            </Text>
          </View>
        )}

        {downloads.map(({ reciterId, surahIds }) => (
          <View key={reciterId} style={styles.reciterSection}>
            <View style={styles.reciterHeader}>
              <Text style={[styles.reciterName, { color: colors.text }]}>
                {getReciterName(reciterId)}
              </Text>
              <TouchableOpacity onPress={() => handleDeleteReciter(reciterId)}>
                <Text
                  style={[
                    styles.deleteAllText,
                    { color: Colors.dark.secondary },
                  ]}
                >
                  Delete all
                </Text>
              </TouchableOpacity>
            </View>

            {surahIds.map((surahId) => (
              <View
                key={surahId}
                style={[
                  styles.surahRow,
                  {
                    borderBottomColor:
                      scheme === 'dark' ? colors.cardBgAlt : '#F0F0F0',
                  },
                ]}
              >
                <Text style={[styles.surahName, { color: colors.text }]}>
                  {getSurahName(surahId)}
                </Text>
                <TouchableOpacity
                  style={styles.trashButton}
                  onPress={() => handleDeleteSurah(reciterId, surahId)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={colors.icon}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}

        {hasDownloads && (
          <TouchableOpacity
            style={[styles.deleteAllButton, { borderColor: '#EF4444' }]}
            onPress={handleDeleteAll}
          >
            <Ionicons name="trash" size={18} color="#EF4444" />
            <Text style={styles.deleteAllButtonText}>
              Delete All Downloads
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DownloadsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
  },
  reciterSection: {
    marginBottom: 20,
  },
  reciterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reciterName: {
    fontSize: 15,
    fontWeight: '600',
  },
  deleteAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  surahRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  surahName: {
    fontSize: 14,
  },
  trashButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  deleteAllButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
});
