import { DateTime } from "luxon";

export const DATE_FORMAT = "ccc, MMM d yyyy";
export const DATE_TIME_FORMAT = "ccc, MMM d yyyy, h:mm a";

export const getDateTimeNow = () => {
  return DateTime.now();
};

export const getDateTimeNowString = () => {
  return DateTime.now().toFormat(DATE_TIME_FORMAT);
};

export const toDateTime = (date: Date) => {
  return DateTime.fromJSDate(date);
};

export const toDateString = (date: Date) => {
  return DateTime.fromJSDate(date).toFormat(DATE_FORMAT);
};

export const toDateTimeString = (date: Date) => {
  return DateTime.fromJSDate(date).toFormat(DATE_TIME_FORMAT);
};

export function toISODate(date: Date) {
  return DateTime.fromJSDate(date).toISODate();
}

export function fromISODate(iso: string) {
  return DateTime.fromISO(iso).toJSDate();
}

export function isoToDateString(iso: string) {
  return DateTime.fromISO(iso).toFormat(DATE_FORMAT);
}

export function isoToDateTimeString(iso: string) {
  return DateTime.fromISO(iso).toFormat(DATE_TIME_FORMAT);
}

export const toDateTimeStringfromDT = (dateTime: DateTime) => {
  return dateTime.toFormat(DATE_TIME_FORMAT);
};

export const getStartOfDay = (date?: Date) => {
  return date
    ? DateTime.fromJSDate(date).startOf("day").toJSDate()
    : DateTime.now().startOf("day").toJSDate();
};
