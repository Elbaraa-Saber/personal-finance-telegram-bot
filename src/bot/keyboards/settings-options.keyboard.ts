import { InlineKeyboard } from "grammy";
import { SupportedLanguage } from "../i18n/language";
import { getMessages } from "../i18n/translations";

export const settingsOptionCallbacks = {
  language: "settings:language",
  currency: "settings:currency",
} as const;

export function createSettingsOptionsKeyboard(
  language: SupportedLanguage
): InlineKeyboard {
  const menu = getMessages(language).menu;

  return new InlineKeyboard()
    .text(menu.language, settingsOptionCallbacks.language)
    .text(menu.currency, settingsOptionCallbacks.currency);
}