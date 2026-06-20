import speakeasy from "speakeasy";
import QRCode from "qrcode";

// GENERATE 2FA SECRET
export async function generate2FASecret(email: string) {
  const secret = speakeasy.generateSecret({
    name: `MTA: (${email})`,
    issuer: "Mini-tweets-application",
    length: 32,
  });

  const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url!);

  return {
    base32: secret.base32,
    qrCodeDataUrl,
  };
}

// VERIFY 2FA SECRET
export function verify2FACode(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1,
  });
}
