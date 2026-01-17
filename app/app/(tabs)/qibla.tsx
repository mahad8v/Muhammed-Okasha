// import React from 'react';
// import { View, Text } from 'react-native';
// export default function Quibla() {
//   return (
//     <View>
//       <Text>Qibla</Text>
//     </View>
//   );
// }
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  useColorScheme,
} from 'react-native';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';
import Svg, { Circle, Line, Text as SvgText, Path, G } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const COMPASS_SIZE = width * 0.85;
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export default function Qibla() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [magnetometer, setMagnetometer] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    requestPermissions();
    return () => {
      subscription?.remove();
    };
  }, []);

  const requestPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to find Qibla direction'
        );
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      calculateQiblaDirection(loc.coords.latitude, loc.coords.longitude);

      const sub = Magnetometer.addListener((data) => {
        let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
        angle = angle < 0 ? angle + 360 : angle;
        setMagnetometer(angle);
      });

      Magnetometer.setUpdateInterval(100);
      setSubscription(sub);
    } catch (error) {
      Alert.alert('Error', 'Failed to get location or magnetometer data');
    }
  };

  const calculateQiblaDirection = (lat: number, lng: number) => {
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;
    const kaabaLatRad = (KAABA_LAT * Math.PI) / 180;
    const kaabaLngRad = (KAABA_LNG * Math.PI) / 180;

    const dLng = kaabaLngRad - lngRad;
    const y = Math.sin(dLng) * Math.cos(kaabaLatRad);
    const x =
      Math.cos(latRad) * Math.sin(kaabaLatRad) -
      Math.sin(latRad) * Math.cos(kaabaLatRad) * Math.cos(dLng);

    let bearing = Math.atan2(y, x) * (180 / Math.PI);
    bearing = (bearing + 360) % 360;
    setQiblaDirection(bearing);
  };

  const qiblaAngle = qiblaDirection - magnetometer;
  const compassRotation = -magnetometer;

  const renderCompass = () => {
    const center = COMPASS_SIZE / 2;
    const radius = center - 40;
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const angles = [0, 45, 90, 135, 180, 225, 270, 315];

    return (
      <Svg width={COMPASS_SIZE} height={COMPASS_SIZE}>
        <G rotation={compassRotation} origin={`${center}, ${center}`}>
          {/* Outer circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={isDark ? '#444' : '#ddd'}
            strokeWidth="3"
          />

          {/* Inner circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius - 20}
            fill="none"
            stroke={isDark ? '#333' : '#eee'}
            strokeWidth="2"
          />

          {/* Direction markers */}
          {directions.map((dir, index) => {
            const angle = (angles[index] * Math.PI) / 180;
            const x1 = center + (radius - 15) * Math.sin(angle);
            const y1 = center - (radius - 15) * Math.cos(angle);
            const x2 = center + radius * Math.sin(angle);
            const y2 = center - radius * Math.cos(angle);
            const textX = center + (radius - 35) * Math.sin(angle);
            const textY = center - (radius - 35) * Math.cos(angle);

            return (
              <G key={dir}>
                <Line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={dir === 'N' ? '#e74c3c' : isDark ? '#666' : '#999'}
                  strokeWidth={dir === 'N' ? '4' : '2'}
                />
                <SvgText
                  x={textX}
                  y={textY}
                  fontSize="16"
                  fontWeight={dir === 'N' ? 'bold' : 'normal'}
                  fill={dir === 'N' ? '#e74c3c' : isDark ? '#999' : '#666'}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {dir}
                </SvgText>
              </G>
            );
          })}

          {/* Degree markers */}
          {[...Array(36)].map((_, i) => {
            const angle = (i * 10 * Math.PI) / 180;
            const isMainDir = i % 9 === 0;
            const x1 =
              center + (radius - (isMainDir ? 0 : 8)) * Math.sin(angle);
            const y1 =
              center - (radius - (isMainDir ? 0 : 8)) * Math.cos(angle);
            const x2 =
              center + (radius - (isMainDir ? 15 : 12)) * Math.sin(angle);
            const y2 =
              center - (radius - (isMainDir ? 15 : 12)) * Math.cos(angle);

            return (
              <Line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isDark ? '#555' : '#ccc'}
                strokeWidth="1"
              />
            );
          })}
        </G>

        {/* Qibla direction indicator (Kaaba icon) */}
        <G rotation={qiblaAngle} origin={`${center}, ${center}`}>
          {/* Kaaba simplified icon */}
          <Path
            d={`M${center - 15},${center - radius + 30} 
                L${center + 15},${center - radius + 30} 
                L${center + 15},${center - radius + 60} 
                L${center - 15},${center - radius + 60} Z`}
            fill="#1a1a1a"
            stroke="#FFD700"
            strokeWidth="2"
          />
          <Path
            d={`M${center - 12},${center - radius + 35} 
                L${center + 12},${center - radius + 35} 
                L${center + 12},${center - radius + 40} 
                L${center - 12},${center - radius + 40} Z`}
            fill="#FFD700"
          />

          {/* Arrow pointing to Kaaba */}
          <Path
            d={`M${center},${center - radius + 15} 
                L${center - 8},${center - radius + 28} 
                L${center + 8},${center - radius + 28} Z`}
            fill="#27ae60"
          />
        </G>

        {/* Center dot (user position) */}
        <Circle cx={center} cy={center} r="8" fill="#e74c3c" />
        <Circle cx={center} cy={center} r="4" fill="#fff" />
      </Svg>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>
          Qibla Direction
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#aaa' : '#666' }]}>
          Point your device towards the Kaaba
        </Text>
      </View>

      <View style={styles.compassContainer}>{renderCompass()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 30,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 13,
  },
});
