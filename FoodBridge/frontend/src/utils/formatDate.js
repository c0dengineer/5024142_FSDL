import { formatDistanceToNow, format, isPast } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy h:mm a');
};

export const formatDateShort = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'h:mm a');
};

export const formatTimeAgo = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const getRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMillis = targetDate - now;

  if (diffInMillis < 0) {
    return 'Expired';
  }

  const diffInMinutes = Math.floor(diffInMillis / (1000 * 60));
  const diffInHours = Math.floor(diffInMillis / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMillis / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m left`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h left`;
  } else {
    return `${diffInDays}d left`;
  }
};

export const isExpired = (date) => {
  return isPast(new Date(date));
};

export const isExpiringWithin = (date, hours) => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMillis = targetDate - now;
  const diffInHours = diffInMillis / (1000 * 60 * 60);
  return diffInHours <= hours && diffInHours > 0;
};
