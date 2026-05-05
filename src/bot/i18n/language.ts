export type SupportedLanguage = "ar" | "ru" | "en";

export const supportedLanguages = ["ar", "ru", "en"] as const;

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return supportedLanguages.includes(value as SupportedLanguage);
}