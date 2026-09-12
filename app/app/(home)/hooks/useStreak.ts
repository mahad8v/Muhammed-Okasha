import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'prayer_streak_dates';
const MAX_STORED_DAYS = 60;
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface DayInteraction {
  [key: string]: boolean | 'future';
}

const toDateKey = (date: Date): string => date.toISOString().slice(0, 10);

const readStoredDates = async (): Promise<string[]> => {
  try {
    const raw = await SecureStore.getItemAsync(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStoredDates = async (dates: string[]): Promise<void> => {
  await SecureStore.setItemAsync(
    STORAGE_KEY,
    JSON.stringify(dates.slice(-MAX_STORED_DAYS)),
  );
};

const computeStreak = (dateSet: Set<string>): number => {
  let streak = 0;
  const cursor = new Date();

  while (dateSet.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

const computeWeekInteractions = (dateSet: Set<string>): DayInteraction => {
  const today = new Date();
  const todayIndex = today.getDay();
  const result: DayInteraction = {};

  DAYS_OF_WEEK.forEach((day, index) => {
    if (index > todayIndex) {
      result[day] = 'future';
      return;
    }

    const date = new Date(today);
    date.setDate(today.getDate() - (todayIndex - index));
    result[day] = dateSet.has(toDateKey(date));
  });

  return result;
};

/**
 * Tracks a daily "opened the app" streak in SecureStore. Recording is
 * automatic: mounting this hook marks today as an interaction day.
 */
export const useStreak = () => {
  const [interactionDates, setInteractionDates] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const stored = await readStoredDates();
      const todayKey = toDateKey(new Date());
      const updated = stored.includes(todayKey)
        ? stored
        : [...stored, todayKey];

      if (updated !== stored) {
        await writeStoredDates(updated);
      }

      if (!cancelled) {
        setInteractionDates(updated);
        setIsLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const dateSet = new Set(interactionDates);

  return {
    isLoaded,
    currentStreak: computeStreak(dateSet),
    weekInteractions: computeWeekInteractions(dateSet),
  };
};
