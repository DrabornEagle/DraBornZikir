import { zikirs, type Zikir } from '../data/zikirs';

export function dayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

export function shiftDay(date: Date, offset: number): Date {
  const shifted = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  shifted.setDate(shifted.getDate() + offset);
  return shifted;
}

function hash(value: string): number {
  let result = 2166136261;
  for (const char of value) {
    result ^= char.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

export function dailySelection(date: Date = new Date()): Zikir[] {
  const key = dayKey(date);
  const groups = [
    zikirs.filter((entry) => entry.category === 'Tesbih'),
    zikirs.filter((entry) => entry.category === 'Dua'),
    zikirs.filter((entry) => entry.category === 'Kur’an')
  ];
  return groups.map((group, index) => group[hash(key + ':' + index) % group.length]);
}

export function streak(counts: Record<string, Record<string, number>>, goal: number, date: Date = new Date()): number {
  let days = 0;
  let cursor = date;
  const total = (key: string) => Object.values(counts[key] ?? {}).reduce((sum, count) => sum + count, 0);
  if (total(dayKey(cursor)) < goal) cursor = shiftDay(cursor, -1);
  while (total(dayKey(cursor)) >= goal) {
    days += 1;
    cursor = shiftDay(cursor, -1);
  }
  return days;
}

export function todayTotal(counts: Record<string, Record<string, number>>, date: Date = new Date()): number {
  return Object.values(counts[dayKey(date)] ?? {}).reduce((sum, count) => sum + count, 0);
}
