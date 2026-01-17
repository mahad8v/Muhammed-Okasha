// import { Colors } from '@/constants/theme';
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   StatusBar,
//   useColorScheme,
// } from 'react-native';
// import {
//   SafeAreaView,
//   useSafeAreaInsets,
// } from 'react-native-safe-area-context';
// import { useQuery } from '@tanstack/react-query';
// import { DailyPrayerResponse } from '@/types/islamicCalenderTypes';
// import { fetchCalendar } from '@/services/calenderApi';
// import { Image } from 'expo-image';
// import DhuhrIcon from '@/components/icons/dhuhr';
// import MagribIcon from '@/components/icons/MagribIcon';
// import IshaIcon from '@/components/icons/IshaIcon';
// import AsrIcon from '@/components/icons/AsrIcon';
// import FajrIcon from '@/components/icons/FajrIcon';
// import Card from '@/components/card';
// import HolyIcon from '@/components/icons/HolyIcon';
// import PrayerIcon from '@/components/icons/PrayerIcon';
// import BeadIcon from '@/components/icons/BeadIcon';
// import DawahIcon from '@/components/icons/Dawag';
// import StreaksComponent from '@/components/ui/streak';

// const HomeScreen = () => {
//   const colorScheme = useColorScheme();
//   type ColorSchemeKey = keyof typeof Colors;
//   const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
//   const colors = Colors[scheme] as (typeof Colors)['light'];

//   const [currentTime, setCurrentTime] = useState(new Date());

//   const { data, isLoading } = useQuery<DailyPrayerResponse>({
//     queryKey: ['calendar'],
//     queryFn: async () => await fetchCalendar(),
//   });

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const insets = useSafeAreaInsets();

//   const blurhash = 'LGFO_ftQ01WBuPNGi^ax02M{^%W=';

//   const fivePrayers = [
//     {
//       name: 'Fajr',
//       time: data?.timings.Fajr,
//       svg: FajrIcon,
//     },
//     {
//       name: 'Dhuhr',
//       time: data?.timings.Dhuhr,
//       svg: DhuhrIcon,
//     },
//     {
//       name: 'Asr',
//       time: data?.timings.Asr,
//       svg: AsrIcon,
//     },
//     {
//       name: 'Maghrib',
//       time: data?.timings.Maghrib,
//       svg: MagribIcon,
//     },
//     {
//       name: 'Isha',
//       time: data?.timings.Isha,
//       svg: IshaIcon,
//     },
//   ];

//   const parseTime = (timeStr: string | undefined) => {
//     if (!timeStr) return null;
//     const [time] = timeStr.split(' ');
//     const [hours, minutes] = time.split(':').map(Number);
//     const date = new Date();
//     date.setHours(hours, minutes, 0, 0);
//     return date;
//   };

//   const getCurrentAndNextPrayer = () => {
//     const now = currentTime;
//     const THRESHOLD_MS = 90 * 60 * 1000;
//     let currentPrayerIndex = -1;
//     let nextPrayerIndex = -1;
//     let showNextPrayerName = false;
//     let timeUntilNext: Date | null = null;

//     for (let i = 0; i < fivePrayers.length; i++) {
//       const prayerTime = parseTime(fivePrayers[i].time);
//       if (!prayerTime) continue;

//       const timeDiff = prayerTime.getTime() - now.getTime();

//       if (timeDiff > 0) {
//         nextPrayerIndex = i;
//         timeUntilNext = prayerTime;

//         if (timeDiff <= THRESHOLD_MS) {
//           showNextPrayerName = true;
//         }

//         if (i > 0) {
//           currentPrayerIndex = i - 1;
//         } else {
//           currentPrayerIndex = fivePrayers.length - 1;
//         }
//         break;
//       }
//     }

//     if (nextPrayerIndex === -1) {
//       nextPrayerIndex = 0;
//       currentPrayerIndex = fivePrayers.length - 1;
//       timeUntilNext = parseTime(fivePrayers[0].time);

//       if (timeUntilNext) {
//         timeUntilNext = new Date(timeUntilNext.getTime() + 24 * 60 * 60 * 1000);
//       }
//     }

//     return {
//       currentPrayerIndex,
//       nextPrayerIndex,
//       showNextPrayerName,
//       timeUntilNext,
//     };
//   };

//   const formatTimeRemaining = (targetTime: Date | null) => {
//     if (!targetTime) return '';

//     const now = currentTime;
//     let diff = targetTime.getTime() - now.getTime();

//     if (diff < 0) {
//       diff += 24 * 60 * 60 * 1000;
//     }

//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

//     return `${hours}h ${minutes}m `;
//   };

//   const prayerInfo = getCurrentAndNextPrayer();

//   return (
//     <SafeAreaView
//       edges={[]}
//       style={[styles.container, { backgroundColor: colors.background }]}
//     >
//       <StatusBar
//         barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
//         backgroundColor="transparent"
//       />

//       <View style={styles.imageContainer}>
//         <Image
//           style={styles.image}
//           source="https://cdn.pixabay.com/photo/2018/12/17/14/25/mosque-3880493_960_720.jpg"
//           placeholder={{ blurhash }}
//           contentFit="cover"
//           transition={1000}
//           resizeMode="cover"
//         />
//         <View style={styles.overlay} />
//         <View style={styles.dateOverlay}>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               marginBottom: 20,
//             }}
//           >
//             <View>
//               <Text style={styles.nextPrayerLabel}>Date</Text>
//               <Text style={styles.dateText}>
//                 {data?.date.hijri.day} {data?.date.hijri.month.en}{' '}
//                 {data?.date.hijri.year} AH
//               </Text>
//             </View>

//             {prayerInfo.nextPrayerIndex !== -1 && (
//               <View
//                 style={{
//                   flexDirection: 'column',
//                   width: 125,
//                 }}
//               >
//                 <Text style={styles.nextPrayerLabel}>Next Prayer</Text>
//                 <View style={styles.nextPrayerContainer}>
//                   <Text style={styles.nextPrayerName}>
//                     {fivePrayers[prayerInfo.nextPrayerIndex].name}
//                   </Text>
//                   <Text style={styles.timeRemaining}>
//                     {formatTimeRemaining(prayerInfo.timeUntilNext)}
//                   </Text>
//                 </View>
//               </View>
//             )}
//           </View>
//         </View>
//       </View>

//       <View>
//         <StreaksComponent currentStreak={currentStreak} colorScheme={scheme} />
//       </View>
//       <View
//         style={{
//           flexDirection: 'row',
//           paddingHorizontal: 20,
//           backgroundColor: colors.background,
//           borderTopLeftRadius: 20,
//           borderTopRightRadius: 20,
//           marginTop: -20,
//         }}
//       >
//         <View
//           style={{
//             flex: 1,
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//           }}
//         >
//           {fivePrayers.map((prayer, index) => {
//             const isCurrentPrayer = index === prayerInfo.currentPrayerIndex;

//             return (
//               <View
//                 key={prayer?.name}
//                 style={{
//                   marginBottom: 8,
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                   paddingVertical: 10,
//                   paddingHorizontal: 8,
//                   borderRadius: 12,
//                 }}
//               >
//                 <Text
//                   style={{
//                     fontWeight: isCurrentPrayer ? '500' : '400',
//                     color: colors.text,
//                   }}
//                 >
//                   {prayer?.name}
//                 </Text>
//                 <View
//                   style={{
//                     margin: 4,
//                   }}
//                 >
//                   <prayer.svg
//                     width={25}
//                     height={25}
//                     color={
//                       isCurrentPrayer
//                         ? scheme === 'dark'
//                           ? Colors.dark.secondary
//                           : Colors.dark.secondary
//                         : colors.text
//                     }
//                   />
//                 </View>
//                 <Text
//                   style={{
//                     fontSize: 14,
//                     fontWeight: isCurrentPrayer ? '500' : '400',
//                     color: colors.text,
//                   }}
//                 >
//                   {prayer?.time}
//                 </Text>
//               </View>
//             );
//           })}
//         </View>
//       </View>
//       <View style={{ marginTop: 20 }}>
//         <View
//           style={{
//             flexDirection: 'row',
//             gap: 10,
//             justifyContent: 'space-between',
//             paddingHorizontal: 20,
//           }}
//         >
//           <View style={{ flex: 1 }}>
//             <Card>
//               <View
//                 style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
//               >
//                 <View
//                   style={{
//                     borderRightColor: '#cccccc9f',
//                     borderRightWidth: 0.4,
//                     paddingRight: 7,
//                   }}
//                 >
//                   <HolyIcon width={27} height={27} color={colors.secondary} />
//                 </View>
//                 <View>
//                   <Text
//                     style={{
//                       color: Colors.dark.secondary,
//                       fontSize: 16,
//                       fontWeight: '500',
//                     }}
//                   >
//                     Quran{' '}
//                   </Text>
//                   <Text style={{ color: colors.text }}>Read and Listen </Text>
//                 </View>
//               </View>
//             </Card>
//           </View>

//           <View style={{ flex: 1 }}>
//             <Card>
//               <View
//                 style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
//               >
//                 <View
//                   style={{
//                     borderRightColor: '#cccccc9f',
//                     borderRightWidth: 0.4,
//                     paddingRight: 7,
//                   }}
//                 >
//                   <PrayerIcon width={27} height={27} color={colors.secondary} />
//                 </View>
//                 <View>
//                   <Text
//                     style={{
//                       color: Colors.dark.secondary,
//                       fontSize: 16,
//                       fontWeight: '500',
//                     }}
//                   >
//                     Dua{' '}
//                   </Text>
//                   <Text style={{ color: colors.text }}>Pray to Allah </Text>
//                 </View>
//               </View>
//             </Card>
//           </View>
//         </View>
//         <View
//           style={{
//             flexDirection: 'row',
//             gap: 10,
//             justifyContent: 'space-between',
//             paddingHorizontal: 20,
//           }}
//         >
//           <View style={{ flex: 1 }}>
//             <Card>
//               <View
//                 style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
//               >
//                 <View
//                   style={{
//                     borderRightColor: '#cccccc9f',
//                     borderRightWidth: 0.4,
//                     paddingRight: 7,
//                   }}
//                 >
//                   <BeadIcon width={27} height={27} color={colors.secondary} />
//                 </View>
//                 <View>
//                   <Text
//                     style={{
//                       color: Colors.dark.secondary,
//                       fontSize: 16,
//                       fontWeight: '500',
//                     }}
//                   >
//                     Tasbi{' '}
//                   </Text>
//                   <Text style={{ color: colors.text }}>Prayer Beads</Text>
//                 </View>
//               </View>
//             </Card>
//           </View>
//           <View style={{ flex: 1 }}>
//             <Card>
//               <View
//                 style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
//               >
//                 <View
//                   style={{
//                     borderRightColor: '#cccccc9f',
//                     borderRightWidth: 0.4,
//                     paddingRight: 7,
//                   }}
//                 >
//                   <DawahIcon width={27} height={27} color={colors.secondary} />
//                 </View>
//                 <View>
//                   <Text
//                     style={{
//                       color: Colors.dark.secondary,
//                       fontSize: 16,
//                       fontWeight: '500',
//                     }}
//                   >
//                     Dawah{' '}
//                   </Text>
//                   <Text style={{ color: colors.text }}>Call to inslam </Text>
//                 </View>
//               </View>
//             </Card>
//           </View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   imageContainer: {
//     height: 290,
//     // marginTop: -70,
//     position: 'relative',
//   },
//   image: {
//     height: '100%',
//     width: '100%',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   },
//   dateOverlay: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     right: 20,
//   },
//   dateText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 4,
//   },
//   nextPrayerContainer: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   nextPrayerLabel: {
//     fontSize: 13,
//     color: '#E0E0E0',
//     fontWeight: '500',
//     marginBottom: 4,
//   },
//   nextPrayerName: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 4,
//   },
//   timeRemaining: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.dark.secondary,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginVertical: 10,
//   },
// });
import { Colors } from '@/constants/theme';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  useColorScheme,
  ScrollView,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { DailyPrayerResponse } from '@/types/islamicCalenderTypes';
import { fetchCalendar } from '@/services/calenderApi';
import { Image } from 'expo-image';
import DhuhrIcon from '@/components/icons/dhuhr';
import MagribIcon from '@/components/icons/MagribIcon';
import IshaIcon from '@/components/icons/IshaIcon';
import AsrIcon from '@/components/icons/AsrIcon';
import FajrIcon from '@/components/icons/FajrIcon';
import Card from '@/components/card';
import HolyIcon from '@/components/icons/HolyIcon';
import PrayerIcon from '@/components/icons/PrayerIcon';
import BeadIcon from '@/components/icons/BeadIcon';
import DawahIcon from '@/components/icons/Dawag';
import StreaksComponent from '@/components/ui/streak';

const HomeScreen = () => {
  const colorScheme = useColorScheme();
  type ColorSchemeKey = keyof typeof Colors;
  const scheme: ColorSchemeKey = (colorScheme ?? 'light') as ColorSchemeKey;
  const colors = Colors[scheme] as (typeof Colors)['light'];

  const [currentTime, setCurrentTime] = useState(new Date());
  const [streakData, setStreakData] = useState({
    currentStreak: 2,
    longestStreak: 12,
    totalPrayers: 47,
  });

  const { data, isLoading } = useQuery<DailyPrayerResponse>({
    queryKey: ['calendar'],
    queryFn: async () => await fetchCalendar(),
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // const insets = useSafeAreaInsets();

  const blurhash = 'LGFO_ftQ01WBuPNGi^ax02M{^%W=';

  const fivePrayers = [
    {
      name: 'Fajr',
      time: data?.timings.Fajr,
      svg: FajrIcon,
    },
    {
      name: 'Dhuhr',
      time: data?.timings.Dhuhr,
      svg: DhuhrIcon,
    },
    {
      name: 'Asr',
      time: data?.timings.Asr,
      svg: AsrIcon,
    },
    {
      name: 'Maghrib',
      time: data?.timings.Maghrib,
      svg: MagribIcon,
    },
    {
      name: 'Isha',
      time: data?.timings.Isha,
      svg: IshaIcon,
    },
  ];

  const parseTime = (timeStr: string | undefined) => {
    if (!timeStr) return null;
    const [time] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const getCurrentAndNextPrayer = () => {
    const now = currentTime;
    const THRESHOLD_MS = 90 * 60 * 1000;
    let currentPrayerIndex = -1;
    let nextPrayerIndex = -1;
    let showNextPrayerName = false;
    let timeUntilNext: Date | null = null;

    for (let i = 0; i < fivePrayers.length; i++) {
      const prayerTime = parseTime(fivePrayers[i].time);
      if (!prayerTime) continue;

      const timeDiff = prayerTime.getTime() - now.getTime();

      if (timeDiff > 0) {
        nextPrayerIndex = i;
        timeUntilNext = prayerTime;

        if (timeDiff <= THRESHOLD_MS) {
          showNextPrayerName = true;
        }

        if (i > 0) {
          currentPrayerIndex = i - 1;
        } else {
          currentPrayerIndex = fivePrayers.length - 1;
        }
        break;
      }
    }

    if (nextPrayerIndex === -1) {
      nextPrayerIndex = 0;
      currentPrayerIndex = fivePrayers.length - 1;
      timeUntilNext = parseTime(fivePrayers[0].time);

      if (timeUntilNext) {
        timeUntilNext = new Date(timeUntilNext.getTime() + 24 * 60 * 60 * 1000);
      }
    }

    return {
      currentPrayerIndex,
      nextPrayerIndex,
      showNextPrayerName,
      timeUntilNext,
    };
  };

  const formatTimeRemaining = (targetTime: Date | null) => {
    if (!targetTime) return '';

    const now = currentTime;
    let diff = targetTime.getTime() - now.getTime();

    if (diff < 0) {
      diff += 24 * 60 * 60 * 1000;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m `;
  };

  const prayerInfo = getCurrentAndNextPrayer();

  return (
    <SafeAreaView
      edges={[]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source="https://cdn.pixabay.com/photo/2018/12/17/14/25/mosque-3880493_960_720.jpg"
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={1000}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
          <View style={styles.dateOverlay}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
                // backgroundColor: 'red',
              }}
            >
              <View>
                <Text style={styles.nextPrayerLabel}>Date</Text>
                <Text style={styles.dateText}>
                  {data?.date.hijri.day} {data?.date.hijri.month.en}{' '}
                  {data?.date.hijri.year} AH
                </Text>
              </View>

              {prayerInfo.nextPrayerIndex !== -1 && (
                <View
                  style={{
                    flexDirection: 'column',
                    width: 125,
                  }}
                >
                  <Text style={styles.nextPrayerLabel}>Next Prayer</Text>
                  <View style={styles.nextPrayerContainer}>
                    <Text style={styles.nextPrayerName}>
                      {fivePrayers[prayerInfo.nextPrayerIndex].name}
                    </Text>
                    <Text style={styles.timeRemaining}>
                      {formatTimeRemaining(prayerInfo.timeUntilNext)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginTop: -20,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            {fivePrayers.map((prayer, index) => {
              const isCurrentPrayer = index === prayerInfo.currentPrayerIndex;

              return (
                <View
                  key={prayer?.name}
                  style={{
                    marginBottom: 8,
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingVertical: 10,
                    paddingHorizontal: 8,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: isCurrentPrayer ? '500' : '400',
                      color: colors.text,
                    }}
                  >
                    {prayer?.name}
                  </Text>
                  <View
                    style={{
                      margin: 4,
                    }}
                  >
                    <prayer.svg
                      width={25}
                      height={25}
                      color={
                        isCurrentPrayer
                          ? scheme === 'dark'
                            ? Colors.dark.secondary
                            : Colors.dark.secondary
                          : colors.text
                      }
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: isCurrentPrayer ? '500' : '400',
                      color: colors.text,
                    }}
                  >
                    {prayer?.time}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <StreaksComponent
            currentStreak={streakData.currentStreak}
            colorScheme={scheme}
          />
        </View>

        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'space-between',
              paddingHorizontal: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <Card>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                >
                  <View
                    style={{
                      borderRightColor: '#cccccc9f',
                      borderRightWidth: 0.4,
                      paddingRight: 7,
                    }}
                  >
                    <HolyIcon width={27} height={27} color={colors.secondary} />
                  </View>
                  <View>
                    <Text
                      style={{
                        color: Colors.dark.secondary,
                        fontSize: 16,
                        fontWeight: '500',
                      }}
                    >
                      Quran{' '}
                    </Text>
                    <Text style={{ color: colors.text }}>Read and Listen </Text>
                  </View>
                </View>
              </Card>
            </View>

            <View style={{ flex: 1 }}>
              <Card>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                >
                  <View
                    style={{
                      borderRightColor: '#cccccc9f',
                      borderRightWidth: 0.4,
                      paddingRight: 7,
                    }}
                  >
                    <PrayerIcon
                      width={27}
                      height={27}
                      color={colors.secondary}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        color: Colors.dark.secondary,
                        fontSize: 16,
                        fontWeight: '500',
                      }}
                    >
                      Dua{' '}
                    </Text>
                    <Text style={{ color: colors.text }}>Pray to Allah </Text>
                  </View>
                </View>
              </Card>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'space-between',
              paddingHorizontal: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <Card>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                >
                  <View
                    style={{
                      borderRightColor: '#cccccc9f',
                      borderRightWidth: 0.4,
                      paddingRight: 7,
                    }}
                  >
                    <BeadIcon width={27} height={27} color={colors.secondary} />
                  </View>
                  <View>
                    <Text
                      style={{
                        color: Colors.dark.secondary,
                        fontSize: 16,
                        fontWeight: '500',
                      }}
                    >
                      Tasbi{' '}
                    </Text>
                    <Text style={{ color: colors.text }}>Prayer Beads</Text>
                  </View>
                </View>
              </Card>
            </View>
            <View style={{ flex: 1 }}>
              <Card>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                >
                  <View
                    style={{
                      borderRightColor: '#cccccc9f',
                      borderRightWidth: 0.4,
                      paddingRight: 7,
                    }}
                  >
                    <DawahIcon
                      width={27}
                      height={27}
                      color={colors.secondary}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        color: Colors.dark.secondary,
                        fontSize: 16,
                        fontWeight: '500',
                      }}
                    >
                      Dawah{' '}
                    </Text>
                    <Text style={{ color: colors.text }}>Call to inslam </Text>
                  </View>
                </View>
              </Card>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 290,
    position: 'relative',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  dateOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  nextPrayerContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  nextPrayerLabel: {
    fontSize: 13,
    color: '#E0E0E0',
    fontWeight: '500',
    marginBottom: 4,
  },
  nextPrayerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  timeRemaining: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
  },
});
