import { Keyboard } from "grammy";
import { defaultLanguage, supportedLanguages, SupportedLanguage } from "../i18n/language";
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
    .text(menu.reportAll)
    .text(menu.reportDay)
    .row()
    .text(menu.reportWeek)
    .text(menu.reportMonth)
    .row()
    .text(menu.reportYear)
    .text(menu.history)
    .row()
    .text(menu.help)
    .text(menu.deleteLast)
    .row()
    .text(menu.language)
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