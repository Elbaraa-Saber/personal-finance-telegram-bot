import { InlineKeyboard } from "grammy";

export const deleteConfirmationCallbacks = {
  confirmDeleteLast: "delete_last:confirm",
  cancelDeleteLast: "delete_last:cancel",
} as const;

export function createDeleteConfirmationKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text("نعم، احذف", deleteConfirmationCallbacks.confirmDeleteLast)
    .text("إلغاء", deleteConfirmationCallbacks.cancelDeleteLast);
}