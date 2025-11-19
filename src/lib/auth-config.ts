const parseNumbers = (value?: string | null): string[] =>
  (value ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((num) => num.replace(/\D/g, ""));

export const getAllowedNumbers = (): string[] => {
  const numbers = parseNumbers(process.env.AUTH_ALLOWED_NUMBERS);
  if (numbers.length === 0) {
    throw new Error("AUTH_ALLOWED_NUMBERS env must contain at least one phone number");
  }
  return numbers;
};

export const getNotificationNumbers = (): string[] => {
  const configured = parseNumbers(process.env.AUTH_NOTIFICATION_NUMBERS);
  return configured.length > 0 ? configured : getAllowedNumbers();
};

export const normalizeNumber = (raw: string): string => raw.replace(/\D/g, "");

export const isAllowedNumber = (raw: string): boolean => {
  const normalized = normalizeNumber(raw);
  return getAllowedNumbers().includes(normalized);
};

