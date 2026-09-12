import { useQuery } from '@tanstack/react-query';
import { DailyPrayerResponse } from '@/types/islamicCalenderTypes';
import { fetchCalendar } from '@/services/calenderApi';

export const useCalendar = () => {
  return useQuery<DailyPrayerResponse>({
    queryKey: ['calendar'],
    queryFn: async () => await fetchCalendar(),
  });
};
