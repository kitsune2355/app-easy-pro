import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/th';
import 'dayjs/locale/en';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.tz.setDefault('Asia/Bangkok');

export const setDayJsLocale = (lang: string) => {
  switch (lang) {
    case 'th':
      dayjs.locale('th');
      break;
    case 'en':
      dayjs.locale('en');
      break;
    default:
      dayjs.locale('en');
      break;
  }
};

export { dayjs as dayJs };
