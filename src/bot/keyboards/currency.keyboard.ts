import { InlineKeyboard } from "grammy";
import { SupportedLanguage } from "../i18n/language";
import { getMessages } from "../i18n/translations";

export const currencyCallbacks = {
  rub: "currency:RUB",
  usd: "currency:USD",
  eur: "currency:EUR",
  egp: "currency:EGP",
  sar: "currency:SAR",
  custom: "currency:custom",
} as const;

export function createCurrencyKeyboard(language: SupportedLanguage): InlineKeyboard {
  const messages = getMessages(language);

  return new InlineKeyboard()
    .text("RUB ₽", currencyCallbacks.rub)
    .text("USD $", currencyCallbacks.usd)
    .row()
    .text("EUR €", currencyCallbacks.eur)
    .text("EGP E£", currencyCallbacks.egp)
    .row()
    .text("SAR ر.س", currencyCallbacks.sar)
    .text(messages.currency.customButton, currencyCallbacks.custom);
}

export function getCurrencyFromCallback(callbackData: string): string | null {
  if (callbackData === currencyCallbacks.rub) {
    return "RUB";
  }

  if (callbackData === currencyCallbacks.usd) {
    return "USD";
  }

  if (callbackData === currencyCallbacks.eur) {
    return "EUR";
  }

  if (callbackData === currencyCallbacks.egp) {
    return "EGP";
  }

  if (callbackData === currencyCallbacks.sar) {
    return "SAR";
  }

  return null;
}