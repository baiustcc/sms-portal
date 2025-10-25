import { PrismaClient } from "@/generated/prisma";

let prismaSingleton: PrismaClient | null = null;

export const getPrismaClient = (): PrismaClient => {
  if (prismaSingleton) return prismaSingleton;
  prismaSingleton = new PrismaClient();
  return prismaSingleton;
};

