import SurahList from '@/app/(quran)/components/SurahList';
import { Shimmer } from '@/components/ui/Shimmer';
import { Colors } from '@/constants/theme';
import { fetchReciters } from '@/services/reciters';
import { Reciter } from '@/types/reciterTypes';
import { getInitials } from '@/utils/textUtils';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
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

type QuranTab = 'listen' | 'read';

const QuranScreen = () => {
  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme] as (typeof Colors)['light'];

  const [activeTab, setActiveTab] = useState<QuranTab>('listen');

  const { data: reciters, isLoading } = useQuery({
    queryKey: ['reciters'],
    queryFn: fetchReciters,
    staleTime: 5 * 60 * 1000,
    enabled: activeTab === 'listen',
  });

  const handleReciterPress = (reciter: Reciter) => {
    router.push({
      pathname: '/reciters/[reciterId]',
      params: { reciterId: reciter.id, name: reciter.name },
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
          Al Quran
        </Text>
        {activeTab === 'listen' && (
          <TouchableOpacity onPress={() => router.push('/downloads')}>
            <Ionicons
              name="download-outline"
              size={22}
              color={Colors.dark.secondary}
            />
          </TouchableOpacity>
        )}
      </View>

      <View
        style={[
          styles.tabContainer,
          { backgroundColor: scheme === 'dark' ? colors.cardBg : '#F3F4F6' },
        ]}
      >
        {(['listen', 'read'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { backgroundColor: colors.background },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === tab ? colors.text : colors.icon,
                  fontWeight: activeTab === tab ? '600' : '500',
                },
              ]}
            >
              {tab === 'listen' ? 'Listen' : 'Read'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'read' ? (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <SurahList />
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.reciterList}>
            {isLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.reciterItem,
                    {
                      borderBottomColor:
                        scheme === 'dark' ? colors.cardBgAlt : '#F0F0F0',
                    },
                  ]}
                >
                  <View style={styles.reciterLeft}>
                    <Shimmer width={40} height={40} borderRadius={20} />
                    <View
                      style={[styles.reciterInfo, { marginLeft: 16, gap: 6 }]}
                    >
                      <Shimmer width="50%" height={14} />
                      <Shimmer width="35%" height={12} />
                    </View>
                  </View>
                </View>
              ))}

            {reciters?.map((reciter) => (
              <TouchableOpacity
                key={reciter.id}
                style={[
                  styles.reciterItem,
                  {
                    borderBottomColor:
                      scheme === 'dark' ? colors.cardBgAlt : '#F0F0F0',
                  },
                ]}
                onPress={() => handleReciterPress(reciter)}
              >
                <View style={styles.reciterLeft}>
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
                    {reciter.avatar ? (
                      <Image
                        source={{ uri: reciter.avatar }}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.avatarInitials,
                          { color: Colors.dark.secondary },
                        ]}
                      >
                        {getInitials(reciter.name)}
                      </Text>
                    )}
                  </View>
                  <View style={styles.reciterInfo}>
                    <Text style={[styles.reciterName, { color: colors.text }]}>
                      {reciter.name}
                    </Text>
                    <Text
                      style={[styles.reciterDetails, { color: '#A67C52' }]}
                    >
                      {reciter.country}
                      {reciter.style ? ` | ${reciter.style}` : ''}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.reciterCount, { color: colors.icon }]}>
                  {reciter.availableSurahIds.length}/114
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default QuranScreen;

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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
  },
  scrollView: {
    flex: 1,
  },
  reciterList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  reciterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  reciterLeft: {
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
  reciterInfo: {
    flex: 1,
  },
  reciterName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  reciterDetails: {
    fontSize: 12,
  },
  reciterCount: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 16,
  },
});
