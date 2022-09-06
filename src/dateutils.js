const XDate = require('xdate');
const { DateTime } = require('luxon');

function sameMonth(a, b) {
  return DateTime.isDateTime(a) && DateTime.isDateTime(b) &&
  a.year === b.year &&
  a.month === b.month;
}

function sameDate(a, b) {
  return DateTime.isDateTime(a) && DateTime.isDateTime(b) &&
    a.year === b.year &&
    a.month === b.month &&
    a.date === b.date;
}

function isGTE(a, b) {
  return b.diff(a, 'days').days < 1;
}

function isLTE(a, b) {
  return a.diff(b, 'days').days < 1;
}

function fromTo(a, b) {
  const days = [];
  let from = a, to = b;
  for (; from.toMillis() <= to.toMillis(); from = from.plus({ days: 1 })) {
    days.push(from);
  }
  return days;
}

function month(dt) {
  const firstDay = dt.startOf('month');
  const lastDay = dt.endOf('month');

  return fromTo(firstDay, lastDay);
}

function weekDayNames(firstDayOfWeek = 0) {
  let weekDaysNames = XDate.locales[XDate.defaultLocale].dayNamesShort;
  const dayShift = firstDayOfWeek % 7;
  if (dayShift) {
    weekDaysNames = weekDaysNames.slice(dayShift).concat(weekDaysNames.slice(0, dayShift));
  }
  return weekDaysNames;
}

function page(dt, firstDayOfWeek) {
  const days = month(dt);
  let before = [], after = [];

  const fdow = ((7 + firstDayOfWeek) % 7) || 7;
  const ldow = (fdow + 6) % 7 || 7;

  // firstDayOfWeek = firstDayOfWeek || 0;

  let from = days[0];

  if (from.weekday !== fdow) {
    from = from.minus({days: (from.weekday + 7 - fdow) % 7});
  }
  
  let to = days[days.length - 1];
  const day = to.weekday;
  if (day !== ldow) {
    to = to.plus({days: (ldow + 7 - day) % 7});
  }
  
  if (isLTE(from, days[0])) {
    before = fromTo(from, days[0]);
  }
  
  if (isGTE(to, days[days.length - 1])) {
    after = fromTo(days[days.length - 1], to);
  }

  return before.concat(days.slice(1, days.length - 1), after);
}

module.exports = {
  weekDayNames,
  sameMonth,
  sameDate,
  month,
  page,
  fromTo,
  isLTE,
  isGTE
};
