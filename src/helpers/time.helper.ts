export function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

export function dateToSeconds(date: Date): number {
  return Math.floor(date.valueOf() / 1000);
}

export function secondsToDate(seconds: number): Date {
  return new Date(seconds * 1000);
}
