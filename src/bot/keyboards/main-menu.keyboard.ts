import { Keyboard } from "grammy";

export const mainMenuButtons = {
  reportAll: "📊 التقرير الكامل",
  reportDay: "📅 تقرير اليوم",
  reportWeek: "📆 تقرير الأسبوع",
  reportMonth: "🗓 تقرير الشهر",
  reportYear: "📈 تقرير السنة",
  history: "🧾 آخر العمليات",
  help: "ℹ️ المساعدة",
  deleteLast: "🗑 حذف آخر عملية",
} as const;

export function createMainMenuKeyboard(): Keyboard {
  return new Keyboard()
    .text(mainMenuButtons.reportAll)
    .text(mainMenuButtons.reportDay)
    .row()
    .text(mainMenuButtons.reportWeek)
    .text(mainMenuButtons.reportMonth)
    .row()
    .text(mainMenuButtons.reportYear)
    .text(mainMenuButtons.history)
    .row()
    .text(mainMenuButtons.help)
    .text(mainMenuButtons.deleteLast)
    .resized();
}