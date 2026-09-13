import { Shimmer } from '@/components/ui/Shimmer';
import { Colors } from '@/constants/theme';
import { fetchScholars } from '@/services/scholars';
import { getInitials } from '@/utils/textUtils';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DawaScreen = () => {
  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme] as (typeof Colors)['light'];

  const { data: scholars, isLoading } = useQuery({
    queryKey: ['scholars'],
    queryFn: fetchScholars,
    staleTime: 5 * 60 * 1000,
  });

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Dawah</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.scholarList}>
          {isLoading &&
            Array.from({ length: 3 }).map((_, index) => (
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
                <Shimmer width={40} height={40} borderRadius={20} />
                <View style={[styles.scholarInfo, { marginLeft: 16, gap: 6 }]}>
                  <Shimmer width="50%" height={14} />
                  <Shimmer width="30%" height={12} />
                </View>
              </View>
            ))}

          {scholars?.map((scholar) => (
            <View
              key={scholar.id}
              style={[
                styles.scholarItem,
                {
                  borderBottomColor:
                    scheme === 'dark' ? colors.cardBgAlt : '#F0F0F0',
                },
              ]}
            >
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
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DawaScreen;

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
  scholarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
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
});
