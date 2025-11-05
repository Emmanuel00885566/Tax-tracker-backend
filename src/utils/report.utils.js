import dayjs from 'dayjs';

export function parseRange(from, to) {
  const start = from ? dayjs(from).startOf('day') : dayjs().startOf('month');
  const end = to ? dayjs(to).endOf('day') : dayjs().endOf('month');
  if (!start.isValid() || !end.isValid()) throw new Error('Invalid date range');
  return { start: start.toDate(), end: end.toDate() };
}

export function formatCurrency(n) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(n || 0);
}