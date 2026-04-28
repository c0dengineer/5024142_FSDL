export const getExpiryColor = (expiresAt) => {
  const now = new Date();
  const expiryDate = new Date(expiresAt);
  const diffInHours = (expiryDate - now) / (1000 * 60 * 60);

  if (diffInHours < 0) {
    return 'danger'; // Expired
  } else if (diffInHours < 1) {
    return 'danger'; // Less than 1 hour
  } else if (diffInHours < 6) {
    return 'warning'; // 1-6 hours
  } else if (diffInHours < 24) {
    return 'info'; // 6-24 hours
  } else {
    return 'success'; // More than 24 hours
  }
};

export const getExpiryStatus = (expiresAt) => {
  const now = new Date();
  const expiryDate = new Date(expiresAt);

  if (expiryDate < now) {
    return { text: 'EXPIRED', color: 'danger', icon: '❌' };
  }

  const diffInMinutes = (expiryDate - now) / (1000 * 60);

  if (diffInMinutes < 60) {
    return { text: 'EXPIRING SOON', color: 'danger', icon: '⚠️' };
  } else if (diffInMinutes < 360) {
    return { text: 'EXPIRING', color: 'warning', icon: '⏰' };
  } else if (diffInMinutes < 1440) {
    return { text: 'EXPIRES TODAY', color: 'info', icon: '🕐' };
  }

  return { text: 'FRESH', color: 'success', icon: '✅' };
};

export const calculateDaysLeft = (expiresAt) => {
  const now = new Date();
  const expiryDate = new Date(expiresAt);
  const diffInDays = (expiryDate - now) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(diffInDays));
};

export const shouldPulseExpiry = (expiresAt) => {
  const now = new Date();
  const expiryDate = new Date(expiresAt);
  const diffInHours = (expiryDate - now) / (1000 * 60 * 60);
  return diffInHours < 2 && diffInHours > 0;
};
