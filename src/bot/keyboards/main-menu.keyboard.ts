import { Keyboard } from "grammy";

export const mainMenuButtons = {
  addIncome: "➕ إضافة دخل",
  addExpense: "➖ إضافة مصروف",
  reportAll: "📊 التقرير الكامل",
  reportDay: "📅 تقرير اليوم",
  reportWeek: "📆 تقرير الأسبوع",
  reportMonth: "🗓 تقرير الشهر",
  reportYear: "📈 تقرير السنة",
  history: "🧾 آخر العمليات",
  help: "ℹ️ المساعدة",
  deleteLast: "🗑 حذف آخر عملية",
  language: "🌐 اللغة / Language",

} as const;

export function createMainMenuKeyboard(): Keyboard {
  return new Keyboard()
    .text(mainMenuButtons.addIncome)
    .text(mainMenuButtons.addExpense)
    .row()
    .text(mainMenuButtons.reportAll)
    .text(mainMenuButtons.reportDay)
    .row()
    .text(mainMenuButtons.reportWeek)
    .text(mainMenuButtons.reportMonth)
    .row()
    .text(mainMenuButtons.reportYear)
    .text(mainMenuButtons.history)
    .row()
    .text(mainMenuButtons.deleteLast)
    .row()
    .text(mainMenuButtons.language)
    .text(mainMenuButtons.help)
    .resized();
}