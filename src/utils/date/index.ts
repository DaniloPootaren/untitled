import format from 'date-fns/format';

export const formatDate = (
  date: string,
  type: 'date' | 'date-time' | 'without-year' | 'dd/MM/yyyy',
) => {
  switch (type) {
    case 'date':
      return format(new Date(date), 'dd MMM yyyy');
    case 'date-time':
      return format(new Date(date), 'dd MMM yyyy HH:mm:ss');
    case 'without-year':
      return format(new Date(date), 'dd MMM');
    case 'dd/MM/yyyy':
      return format(new Date(date), 'dd/MM/yyyy');
  }
};
