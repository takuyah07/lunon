const JST_TIMEZONE = "Asia/Tokyo";

const jstFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: JST_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const pad = (value: number) => value.toString().padStart(2, "0");

const toJstParts = (date: Date) => {
  const [year, month, day] = jstFormatter
    .format(date)
    .split("-")
    .map((part) => Number(part));

  return { year, month, day };
};

export type MonthRange = {
  start: Date;
  end: Date;
  monthYm: string;
};

export const formatMonthYmJst = (date: Date = new Date()) => {
  const { year, month } = toJstParts(date);
  return `${year}-${pad(month)}`;
};

export const getMonthStartJst = (date: Date = new Date()) => {
  const { year, month } = toJstParts(date);
  return new Date(`${year}-${pad(month)}-01T00:00:00+09:00`);
};

export const getMonthEndJst = (date: Date = new Date()) => {
  const { year, month } = toJstParts(date);
  const nextYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  return new Date(`${nextYear}-${pad(nextMonth)}-01T00:00:00+09:00`);
};

export const getMonthRangeJst = (date: Date = new Date()): MonthRange => {
  const start = getMonthStartJst(date);
  const end = getMonthEndJst(date);
  return {
    start,
    end,
    monthYm: formatMonthYmJst(date),
  };
};
