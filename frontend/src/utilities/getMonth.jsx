import dayjs from "dayjs";

export function getMonth(month = dayjs().month()) {
  const year = dayjs().year(); // get current year
  const firstDayofTheMonth = dayjs(new Date(year, month, 1)).day(); // get first day of the month
  let currentMonthCount = 0 - firstDayofTheMonth; // get current day (sunday - saturday)

  // to create calendar table
  const dayMatrix = new Array(6).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });

  return dayMatrix;
}
