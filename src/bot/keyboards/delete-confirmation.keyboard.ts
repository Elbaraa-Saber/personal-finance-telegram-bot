import { InlineKeyboard } from "grammy";
import {
  defaultLanguage,
  SupportedLanguage,
} from "../i18n/language";
import { getMessages } from "../i18n/translations";

export const deleteConfirmationCallbacks = {
  confirmDeleteLast: "delete_last:confirm",
  cancelDeleteLast: "delete_last:cancel",
} as const;

export function createDeleteConfirmationKeyboard(
  language: SupportedLanguage = defaultLanguage
): InlineKeyboard {
  const messages = getMessages(language);

  return new InlineKeyboard()
    .text(messages.delete.confirmButton, deleteConfirmationCallbacks.confirmDeleteLast)
    .text(messages.delete.cancelButton, deleteConfirmationCallbacks.cancelDeleteLast);
}