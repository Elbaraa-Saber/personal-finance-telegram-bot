
import { InlineKeyboard } from "grammy";
import { SupportedLanguage } from "../i18n/language";

export const languageCallbacks = {
  ar: "language:ar",
  ru: "language:ru",
  en: "language:en",
} as const;

export function createLanguageKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text("العربية", languageCallbacks.ar)
    .text("Русский", languageCallbacks.ru)
    .text("English", languageCallbacks.en);
}

export function getLanguageFromCallback(
  callbackData: string
): SupportedLanguage | null {
  if (callbackData === languageCallbacks.ar) {
    return "ar";
  }

  if (callbackData === languageCallbacks.ru) {
    return "ru";
  }

  if (callbackData === languageCallbacks.en) {
    return "en";
  }

  return null;
}