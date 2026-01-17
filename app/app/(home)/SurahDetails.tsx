import { Colors } from '@/constants/theme';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import PlayIcon from '@/components/icons/playIcon';
import Card from '@/components/card';

const SurahDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme];

  // Get surah data from params
  const surah = {
    number: params.number,
    name: params.name || 'An-Nisa',
    arabic: params.arabic || 'النساء',
    verses: params.verses || '176 Verses',
    revelation: params.revelation,
  };

  const [isDarkMode, setIsDarkMode] = useState(scheme === 'dark');

  const verses = [
    {
      number: 1,
      arabic:
        'يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُم مِّن نَّفْسٍ وَاحِدَةٍ وَخَلَقَ مِنْهَا زَوْجَهَا وَبَثَّ مِنْهُمَا رِجَالًا كَثِيرًا وَنِسَاءً ۚ وَاتَّقُوا اللَّهَ الَّذِي تَسَاءَلُونَ بِهِ وَالْأَرْحَامَ ۚ إِنَّ اللَّهَ كَانَ عَلَيْكُمْ رَقِيبًا',
      translation:
        'O mankind, fear your Lord, who created you from one soul and created from it its mate and dispersed from both of them many men and women. And fear Allah, through whom you ask one another, and the wombs. Indeed Allah is ever, over you, an Observer"',
    },
    {
      number: 2,
      arabic:
        'وَآتُوا الْيَتَامَىٰ أَمْوَالَهُمْ ۖ وَلَا تَتَبَدَّلُوا الْخَبِيثَ بِالطَّيِّبِ ۖ وَلَا تَأْكُلُوا أَمْوَالَهُمْ إِلَىٰ أَمْوَالِكُمْ ۚ إِنَّهُ كَانَ حُوبًا كَبِيرًا',
      translation:
        'And give to the orphans their properties and do not substitute the defective [of your own] for the good [of theirs]. And do not consume their properties into your own. Indeed, that is ever a great sin.',
    },
  ];

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
      /> */}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Surah Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.surahTitle, { color: colors.text }]}>
            {surah.name} - The Woman
          </Text>
          <Text style={[styles.verseCount, { color: colors.icon }]}>
            {surah.verses}
          </Text>
        </View>

        <View style={styles.bismillahContainer}>
          <Text style={[styles.bismillah, { color: colors.text }]}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </Text>
        </View>

        {/* Verses */}
        {verses.map((verse) => (
          // <View
          //   key={verse.number}
          //   style={[styles.verseCard, { backgroundColor: colors.cardBg }]}
          // >
          <Card>
            <View style={styles.verseHeader}>
              <View
                style={[styles.verseNumberBadge, { borderColor: colors.text }]}
              >
                <Text style={[styles.verseNumberIcon, { color: colors.text }]}>
                  ✦
                </Text>
              </View>

              <View style={styles.verseActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <PlayIcon width={35} height={35} color={colors.icon} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Arabic Text */}
            <Text style={[styles.arabicText, { color: colors.text }]}>
              {verse.arabic}
            </Text>

            {/* Translation */}
            <Text style={[styles.translationText, { color: colors.icon }]}>
              {verse.translation}
            </Text>

            {/* Bottom Actions */}
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '600',
  },
  themeToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
  },
  themeButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  themeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
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
    paddingVertical: 24,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  bismillah: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  verseCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: Colors.light.cardBg,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  verseNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseNumberIcon: {
    fontSize: 16,
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
  actionIcon: {
    fontSize: 18,
  },
  arabicText: {
    fontSize: 22,
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
  verseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
});
