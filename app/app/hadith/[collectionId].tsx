import { EmptyState } from '@/components/ui/EmptyState';
import { Shimmer } from '@/components/ui/Shimmer';
import { Colors } from '@/constants/theme';
import { fetchHadiths, HadithNotFoundError } from '@/services/hadithApi';
import { HadithGrade, HadithItem } from '@/types/hadithTypes';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GRADE_FILTERS: { label: string; value?: HadithGrade }[] = [
  { label: 'All' },
  { label: 'Sahih', value: 'Sahih' },
  { label: 'Hasan', value: 'Hasan' },
  { label: "Da'eef", value: 'Da`eef' },
];

export default function HadithListScreen() {
  const { collectionId } = useLocalSearchParams<{ collectionId: string }>();

  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme];

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<HadithGrade | undefined>(
    undefined,
  );

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['hadiths', collectionId, debouncedSearch, gradeFilter],
    queryFn: ({ pageParam }) =>
      fetchHadiths({
        bookSlug: collectionId,
        page: pageParam,
        status: gradeFilter,
        searchEnglish: debouncedSearch || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : undefined,
  });

  const hadiths = data?.pages.flatMap((page) => page.data) ?? [];

  if (isError) {
    const isNotFound = error instanceof HadithNotFoundError;

    return (
      <SafeAreaView
        edges={['bottom']}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {isNotFound ? (
          <EmptyState
            emoji="📖"
            title="Collection not found"
            subtitle="We couldn't find any hadiths for this collection. It may have been renamed or removed."
          />
        ) : (
          <EmptyState
            emoji="⚠️"
            title="Something went wrong"
            subtitle={(error as Error)?.message ?? 'Please try again.'}
          />
        )}
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: HadithItem }) => (
    <View
      style={[
        styles.hadithItem,
        {
          borderBottomColor: scheme === 'dark' ? colors.cardBgAlt : '#F0F0F0',
        },
      ]}
    >
      <View style={styles.hadithHeader}>
        <Text style={[styles.hadithNumber, { color: Colors.dark.secondary }]}>
          #{item.hadithNumber}
        </Text>
        <Text style={[styles.gradeBadge, { color: colors.icon }]}>
          {item.status}
        </Text>
      </View>

      {!!item.hadithArabic && (
        <Text
          style={[
            styles.hadithTextArabic,
            { color: colors.text, writingDirection: 'rtl' },
          ]}
        >
          {item.hadithArabic}
        </Text>
      )}

      {!!item.englishNarrator && (
        <Text style={[styles.narrator, { color: colors.icon }]}>
          {item.englishNarrator}
        </Text>
      )}

      <Text style={[styles.hadithText, { color: colors.text }]}>
        {item.hadithEnglish}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              color: colors.text,
              borderColor: colors.cardBgAlt,
              backgroundColor: colors.cardBg,
            },
          ]}
          placeholder="Search hadiths..."
          placeholderTextColor={colors.icon}
          value={searchInput}
          onChangeText={setSearchInput}
          autoCorrect={false}
        />

        <View style={styles.gradeRow}>
          {GRADE_FILTERS.map((filter) => {
            const isActive = gradeFilter === filter.value;
            return (
              <TouchableOpacity
                key={filter.label}
                style={[
                  styles.gradeChip,
                  {
                    backgroundColor: isActive
                      ? Colors.dark.secondary
                      : colors.cardBg,
                  },
                ]}
                onPress={() => setGradeFilter(filter.value)}
              >
                <Text
                  style={[
                    styles.gradeChipText,
                    { color: isActive ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.listContent}>
          {Array.from({ length: 6 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.hadithItem,
                {
                  borderBottomColor:
                    scheme === 'dark' ? colors.cardBgAlt : '#F0F0F0',
                },
              ]}
            >
              <View style={styles.hadithHeader}>
                <Shimmer width={40} height={14} />
                <Shimmer width={50} height={12} />
              </View>
              <Shimmer width="95%" height={22} />
              <Shimmer width="80%" height={14} />
              <Shimmer width="60%" height={14} />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={hadiths}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                style={{ marginVertical: 16 }}
                color={Colors.dark.secondary}
              />
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              emoji="🔍"
              title="No matching hadiths"
              subtitle={
                debouncedSearch || gradeFilter
                  ? 'Try a different search term or grade filter.'
                  : 'This collection has no hadiths to show right now.'
              }
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  gradeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  gradeChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  gradeChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  hadithItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 8,
  },
  hadithHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hadithNumber: {
    fontSize: 13,
    fontWeight: '700',
  },
  gradeBadge: {
    fontSize: 11,
    fontWeight: '500',
  },
  hadithTextArabic: {
    fontSize: 18,
    lineHeight: 30,
    textAlign: 'right',
  },
  narrator: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  hadithText: {
    fontSize: 14,
    lineHeight: 21,
  },
});
