import { DailyPrayerResponse } from '@/types/islamicCalenderTypes';
import axios from 'axios';

export const fetchCalendar = async (): Promise<DailyPrayerResponse> => {
  const res = await axios.get(
    'https://api.aladhan.com/v1/timings?latitude=13.4531&longitude=-16.5775&method=2'
  );

  return res.data.data;
};
