import { Keyboard } from "grammy";
import {
  defaultLanguage,
  supportedLanguages,
  SupportedLanguage,
} from "../i18n/language";
import { getMessages, MenuMessages } from "../i18n/translations";

type MenuButtonKey = keyof MenuMessages;

export function createMainMenuKeyboard(
  language: SupportedLanguage = defaultLanguage
): Keyboard {
  const menu = getMessages(language).menu;

  return new Keyboard()
    .text(menu.addIncome)
    .text(menu.addExpense)
    .row()
    .text(menu.reportDay)
    .text(menu.moreReports)
    .row()
    .text(menu.history)
    .text(menu.deleteLast)
    .row()
    .text(menu.settings)
    .row()
    .text(menu.help)
    .resized();
}

export function getMainMenuButtonTexts(key: MenuButtonKey): string[] {
  return supportedLanguages.map((language) => getMessages(language).menu[key]);
}

export function isMainMenuButtonText(text: string): boolean {
  return supportedLanguages.some((language) =>
    Object.values(getMessages(language).menu).includes(text)
  );
}