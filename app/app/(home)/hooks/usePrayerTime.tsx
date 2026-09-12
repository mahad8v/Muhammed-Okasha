import { useState, useEffect, useMemo } from 'react';
import { DailyPrayerResponse } from '@/types/islamicCalenderTypes';

export interface Prayer {
  name: string;
  time: string | undefined;
  svg: React.ComponentType<any>;
}

export interface PrayerInfo {
  currentPrayerIndex: number;
  nextPrayerIndex: number;
  showNextPrayerName: boolean;
  timeUntilNext: Date | null;
}

export const usePrayerTimes = (prayers: Prayer[]) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const parseTime = (timeStr: string | undefined): Date | null => {
    if (!timeStr) return null;
    const [time] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const getCurrentAndNextPrayer = (): PrayerInfo => {
    const now = currentTime;
    const THRESHOLD_MS = 90 * 60 * 1000;
    let currentPrayerIndex = -1;
    let nextPrayerIndex = -1;
    let showNextPrayerName = false;
    let timeUntilNext: Date | null = null;

    for (let i = 0; i < prayers.length; i++) {
      const prayerTime = parseTime(prayers[i].time);
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
          currentPrayerIndex = prayers.length - 1;
        }
        break;
      }
    }

    if (nextPrayerIndex === -1) {
      nextPrayerIndex = 0;
      currentPrayerIndex = prayers.length - 1;
      timeUntilNext = parseTime(prayers[0].time);

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

  const formatTimeRemaining = (targetTime: Date | null): string => {
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

  const prayerInfo = useMemo(
    () => getCurrentAndNextPrayer(),
    [currentTime, prayers],
  );

  return {
    currentTime,
    prayerInfo,
    formatTimeRemaining,
  };
};
