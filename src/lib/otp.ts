import { getNotificationNumbers, isAllowedNumber, normalizeNumber } from "./auth-config";
import { sendSingleSms } from "./sms";

type OtpEntry = {
  code: string;
  expiresAt: number;
  attempts: number;
  ip?: string | null;
  userAgent?: string | null;
  clientIp?: string | null;
};

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const otpStore = new Map<string, OtpEntry>();

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const formatIp = (ip?: string | null) => ip?.split(",").map((part) => part.trim())[0] || "unknown";

const maskNumber = (number: string) => {
  if (number.length < 4) return number;
  return `${number.slice(0, number.length - 4).replace(/\d/g, "•")}${number.slice(-4)}`;
};

const buildNotificationBody = ({
  code,
  number,
  clientIp,
  detectedIp,
  userAgent,
}: {
  code: string;
  number: string;
  clientIp?: string | null;
  detectedIp?: string | null;
  userAgent?: string | null;
}) => {
  const timestamp = new Date().toISOString();
  const lines = [
    `OTP is requested to access the SMS Portal`,
    `OTP: ${code}`,
    `User: ${maskNumber(number)}`,
    `Client IP: ${clientIp || "unknown"}`,
    `Detected IP: ${formatIp(detectedIp)}`,
    `UA: ${userAgent ? userAgent.slice(0, 80) : "n/a"}`,
    `Time: ${timestamp}`,
  ];
  return lines.join("\n");
};

export const requestOtp = async ({
  number,
  ip,
  clientIp,
  userAgent,
}: {
  number: string;
  ip?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
}) => {
  if (!isAllowedNumber(number)) {
    throw new Error("Phone number is not permitted");
  }
  const normalized = normalizeNumber(number);
  const code = generateOtp();
  otpStore.set(normalized, { code, expiresAt: Date.now() + OTP_TTL_MS, attempts: 0, ip, userAgent, clientIp });
  const recipients = getNotificationNumbers();
  const body = buildNotificationBody({ code, number: normalized, clientIp, detectedIp: ip, userAgent });
  await Promise.all(
    recipients.map((recipient) =>
      sendSingleSms({
        number: recipient,
        message: body,
      }).catch((err) => {
        console.error("Failed to send OTP notification", recipient, err);
        throw err;
      })
    )
  );
  return { expiresAt: Date.now() + OTP_TTL_MS };
};

export const verifyOtp = (number: string, code: string) => {
  const normalized = normalizeNumber(number);
  const entry = otpStore.get(normalized);
  if (!entry) return false;
  if (entry.expiresAt < Date.now()) {
    otpStore.delete(normalized);
    return false;
  }
  if (entry.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(normalized);
    return false;
  }
  entry.attempts += 1;
  const isValid = entry.code === code;
  if (isValid) {
    otpStore.delete(normalized);
    return true;
  }
  return false;
};
