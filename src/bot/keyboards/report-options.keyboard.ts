import { InlineKeyboard } from "grammy";
import { SupportedLanguage } from "../i18n/language";
import { getMessages } from "../i18n/translations";

export const reportOptionCallbacks = {
  all: "report:all",
  week: "report:week",
  month: "report:month",
  year: "report:year",
} as const;

export function createReportOptionsKeyboard(
  language: SupportedLanguage
): InlineKeyboard {
  const menu = getMessages(language).menu;

  return new InlineKeyboard()
    .text(menu.reportAll, reportOptionCallbacks.all)
    .row()
    .text(menu.reportWeek, reportOptionCallbacks.week)
    .text(menu.reportMonth, reportOptionCallbacks.month)
    .row()
    .text(menu.reportYear, reportOptionCallbacks.year);
}