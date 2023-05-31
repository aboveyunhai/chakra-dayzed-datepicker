export const Month_Names_Full = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const Month_Names_Short = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const Weekday_Names_Short = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

export function daysForLocale(
  localeName: string = 'en-US',
  weekday: 'short' | 'long' = 'short'
) {
  const { format } = new Intl.DateTimeFormat(localeName, { weekday });
  return [...Array(7).keys()].map((day) =>
    format(new Date(Date.UTC(2021, 5, day - 1)))
  );
}

export function monthsForLocale(
  localeName: string = 'en-US',
  monthFormat: 'short' | 'long' = 'short'
) {
  const { format } = new Intl.DateTimeFormat(localeName, {
    month: monthFormat,
  });
  return [...Array(12).keys()].map((m) =>
    format(new Date(Date.UTC(2021, m % 12)))
  );
}
