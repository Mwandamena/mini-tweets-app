export function genNumeric(length = 6) {
  let s = "";
  for (let i = 0; i < length; i++) s += Math.floor(Math.random() * 10);
  return s;
}

export const generateOTP = () => {
  const otp = genNumeric();
  const expiresAt = 5 * 60;
  const maxAttempts = 0;
  return { otp, expiresAt, maxAttempts };
};
