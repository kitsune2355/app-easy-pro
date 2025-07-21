import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/th';
import 'dayjs/locale/en';
import relativeTime from 'dayjs/plugin/relativeTime';
import i18n from './il8n';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.tz.setDefault('Asia/Bangkok');
dayjs.locale(i18n.language);

i18n.on('languageChanged', (lng: string) => {
  dayjs.locale(lng);
});

export { dayjs as dayJs };
