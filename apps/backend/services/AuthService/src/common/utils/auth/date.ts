// 5 minutes
export const FIVE_MIN = new Date(Date.now() + 5 * 60 * 1000);

// 10 minutes
export const TEN_MIN = new Date(Date.now() + 10 * 60 * 1000);

// 15 minutes
export const FIFTEEN_MIN = new Date(Date.now() + 15 * 60 * 1000);

// 1 hour
export const ONE_HOUR = new Date(Date.now() + 60 * 60 * 1000);

// 24 hours
export const DAY = new Date(Date.now() + 24 * 60 * 60 * 1000);

export const getExpiryDate = (minutes: number) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};
