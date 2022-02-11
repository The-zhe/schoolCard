const getDate = time => {
  let timeUntil = '';
  if (time) {
    if (time instanceof Date) {
      timeUntil = time;
    } else if (typeof time === 'number') {
      timeUntil = new Date(time);
    } else if (typeof time === 'string') {
      timeUntil = new Date(time.replace(/(-)/g, '/'));
    }
  } else {
    timeUntil = new Date();
  }
  return timeUntil;
};

// 日期格式化
export const formatDate = time => {
  let timeUntil = getDate(time);
  let week = [
    '星期天',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  ];
  let year = timeUntil.getFullYear();
  let month =
    timeUntil.getMonth() + 1 < 10
      ? '0' + (timeUntil.getMonth() + 1)
      : timeUntil.getMonth() + 1;
  let day =
    timeUntil.getDate() < 10 ? '0' + timeUntil.getDate() : timeUntil.getDate();
  let hour =
    timeUntil.getHours() < 10
      ? '0' + timeUntil.getHours()
      : timeUntil.getHours();
  let minute =
    timeUntil.getMinutes() < 10
      ? '0' + timeUntil.getMinutes()
      : timeUntil.getMinutes();
  week = week[timeUntil.getDay()];
  let value = `${year}-${month}-${day}`;
  return { year, month, day, hour, minute, week, value };
};
