import { Keyboard } from "grammy";
import {
  defaultLanguage,
  supportedLanguages,
  SupportedLanguage,
} from "../i18n/language";
import { getMessages } from "../i18n/translations";

export function createCancelFlowKeyboard(
  language: SupportedLanguage = defaultLanguage
): Keyboard {
  return new Keyboard()
    .text(getMessages(language).transactionFlow.cancelButton)
    .resized();
}

export function getCancelFlowButtonTexts(): string[] {
  return supportedLanguages.map(
    (language) => getMessages(language).transactionFlow.cancelButton
  );
}

export function isCancelFlowButtonText(text: string): boolean {
  return getCancelFlowButtonTexts().includes(text);
}