import { Shimmer } from '@/components/ui/Shimmer';
import { Colors } from '@/constants/theme';
import { fetchTafsirScholars } from '@/services/tafsirs';
import { TafsirScholar } from '@/types/tafsirTypes';
import { getInitials } from '@/utils/textUtils';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TafsirScreen = () => {
  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme] as (typeof Colors)['light'];

  const { data: scholars, isLoading } = useQuery({
    queryKey: ['tafsirScholars'],
    queryFn: fetchTafsirScholars,
    staleTime: 5 * 60 * 1000,
  });

  const handleScholarPress = (scholar: TafsirScholar) => {
    router.push({
      pathname: '/scholar/[scholarId]',
      params: { scholarId: scholar.id, name: scholar.name },
    });
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
      />

      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Tafsir
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.scholarList}>
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.scholarItem,
                  {
                    borderBottomColor:
                      scheme === 'dark' ? colors.cardBgAlt : '#F0F0F0',
                  },
                ]}
              >
                <View style={styles.scholarLeft}>
                  <Shimmer width={40} height={40} borderRadius={20} />
                  <View
                    style={[styles.scholarInfo, { marginLeft: 16, gap: 6 }]}
                  >
                    <Shimmer width="50%" height={14} />
                    <Shimmer width="35%" height={12} />
                  </View>
                </View>
              </View>
            ))}

          {!isLoading && scholars?.length === 0 && (
            <Text style={[styles.emptyText, { color: colors.icon }]}>
              No tafsir scholars added yet.
            </Text>
          )}

          {scholars?.map((scholar) => (
            <TouchableOpacity
              key={scholar.id}
              style={[
                styles.scholarItem,
                {
                  borderBottomColor:
                    scheme === 'dark' ? colors.cardBgAlt : '#F0F0F0',
                },
              ]}
              onPress={() => handleScholarPress(scholar)}
            >
              <View style={styles.scholarLeft}>
                <View
                  style={[
                    styles.avatarContainer,
                    {
                      borderColor:
                        scheme === 'dark' ? colors.cardBgAlt : '#E0E0E0',
                      backgroundColor: colors.cardBgAlt,
                    },
                  ]}
                >
                  {scholar.avatar ? (
                    <Image
                      source={{ uri: scholar.avatar }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.avatarInitials,
                        { color: Colors.dark.secondary },
                      ]}
                    >
                      {getInitials(scholar.name)}
                    </Text>
                  )}
                </View>
                <View style={styles.scholarInfo}>
                  <Text style={[styles.scholarName, { color: colors.text }]}>
                    {scholar.name}
                  </Text>
                  <Text style={[styles.scholarDetails, { color: '#A67C52' }]}>
                    {scholar.country}
                    {scholar.title ? ` | ${scholar.title}` : ''}
                  </Text>
                </View>
              </View>
              <Text style={[styles.scholarCount, { color: colors.icon }]}>
                {scholar.availableSurahIds.length}/114
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TafsirScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scholarList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 40,
  },
  scholarItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  scholarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontSize: 14,
    fontWeight: '600',
  },
  scholarInfo: {
    flex: 1,
  },
  scholarName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  scholarDetails: {
    fontSize: 12,
  },
  scholarCount: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 16,
  },
});
