const { DateTime } = require('luxon');

function padNumber(n) {
  if (n < 10) {
    return '0' + n;
  }
  return n;
}

function xdateToData(dt) {
  return {
    year: dt.year,
    month: dt.month,
    day: dt.day,
    timestamp: dt.startOf('day').toMillis(),
    dateString: dt.toFormat('yyyy-MM-dd')
  };
}

function parseDate(d) {
  if (!d) {
    return;
  } else if (d.timestamp) { // conventional data timestamp
    return DateTime.fromMillis(d.timestamp, {zone: 'utc'});
  } else if (DateTime.isDateTime(d)) { // datetime
    return DateTime.utc(d.year, d.month, d.day);
  } else if (d.getTime) { // javascript date
    const dateString = d.getFullYear() + '-' + padNumber((d.getMonth() + 1)) + '-' + padNumber(d.getDate());
    return DateTime.fromISO(dateString, {zone: 'utc'});
  } else if (d.year) {
    const dateString = d.year + '-' + padNumber(d.month) + '-' + padNumber(d.day);
    return DateTime.fromISO(dateString, {zone: 'utc'});
  } else if (typeof d === 'number') { // timestamp nuber
    return DateTime.fromMillis(d, {zone: 'utc'});
  } else if (typeof d === 'string') { // date formatted as string
    return DateTime.fromISO(d, {zone: 'utc'});
  }
}

module.exports = {
  xdateToData,
  parseDate
};

