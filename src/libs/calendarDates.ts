export const getCalendarDates = (year: number, month: number) => {
  const date = new Date(year, month, 1);

  let days: Array<Date> = [];
  while (date.getMonth() === month) {
    const currentDay = new Date(date);
    days.push(currentDay);
    date.setDate(date.getDate() + 1);
  }

  const firstDay = days[0].getDay();
  const lastDay = days[days.length - 1].getDay();

  if (firstDay != 1 && firstDay < 1) {
    for (let i = firstDay; i < 6; i++) {
      days.unshift(new Date(year, month, -i));
    }
  } else if (firstDay != 1 && firstDay > 1) {
    for (let i = 0; i < firstDay - 1; i++) {
      days.unshift(new Date(year, month, -i));
    }
  }

  if (lastDay != 0) {
    for (let i = 1; i <= 7 - lastDay; i++) {
      days.push(new Date(year, month + 1, i));
    }
  }

  return days;
};
