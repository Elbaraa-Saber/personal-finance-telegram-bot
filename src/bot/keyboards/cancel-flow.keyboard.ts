import { Keyboard } from "grammy";

export const cancelFlowButton = "❌ إلغاء العملية";

export function createCancelFlowKeyboard(): Keyboard {
  return new Keyboard()
    .text(cancelFlowButton)
    .resized();
}