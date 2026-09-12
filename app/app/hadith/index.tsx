import { Shimmer } from '@/components/ui/Shimmer';
import { Colors } from '@/constants/theme';
import { fetchHadithBooks } from '@/services/hadithApi';
import { HadithBook } from '@/types/hadithTypes';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HadithCollectionsScreen() {
  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme];

  const {
    data: books,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['hadithBooks'],
    queryFn: fetchHadithBooks,
  });

  const handlePress = (book: HadithBook) => {
    router.push({
      pathname: '/hadith/[collectionId]',
      params: { collectionId: book.bookSlug, name: book.bookName },
    });
  };

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.heading, { color: colors.text }]}>Hadith</Text>

      {isError ? (
        <View style={styles.centerContainer}>
          <Text style={{ color: colors.text }}>
            Error loading books: {(error as Error)?.message}
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.list}>
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.item,
                      {
                        borderBottomColor:
                          scheme === 'dark' ? colors.cardBgAlt : '#F0F0F0',
                      },
                    ]}
                  >
                    <Shimmer width="55%" height={16} />
                    <Shimmer
                      width="35%"
                      height={12}
                      style={{ marginTop: 8 }}
                    />
                  </View>
                ))
              : books?.map((book) => (
                  <TouchableOpacity
                    key={book.id}
                    style={[
                      styles.item,
                      {
                        borderBottomColor:
                          scheme === 'dark' ? colors.cardBgAlt : '#F0F0F0',
                      },
                    ]}
                    onPress={() => handlePress(book)}
                  >
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemName, { color: colors.text }]}>
                        {book.bookName}
                      </Text>
                      <Text style={[styles.itemMeta, { color: colors.icon }]}>
                        {book.writerName}
                      </Text>
                      <Text
                        style={[
                          styles.itemMeta,
                          { color: Colors.dark.secondary },
                        ]}
                      >
                        {book.hadiths_count} hadiths · {book.chapters_count}{' '}
                        chapters
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
          </View>
        </ScrollView>
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
    paddingHorizontal: 32,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  itemInfo: {
    gap: 4,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemMeta: {
    fontSize: 12,
  },
});
