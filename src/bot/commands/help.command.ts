import { Bot } from "grammy";

const helpMessage = `
👋 أهلاً بك في بوت إدارة المصاريف

الأوامر المتاحة:

/start
تسجيل المستخدم وتشغيل البوت

/help
عرض هذه المساعدة

/income (amount) (category)
إضافة دخل
مثال:
/income 5000 salary

/expense (amount) (category)
إضافة مصروف
مثال:
/expense 250 food lunch

/report
عرض التقرير الكامل

/report_day
عرض تقرير اليوم

/report_week
عرض تقرير الأسبوع الحالي

/report_month
عرض تقرير الشهر الحالي

/report_year
عرض تقرير السنة الحالية

/history
عرض آخر العمليات

/delete_last
حذف آخر عملية قمت بإضافتها

ملاحظات:
- المبلغ يجب أن يكون رقمًا أكبر من صفر.
- التصنيف يكون كلمة واحدة مثل: food, salary, transport.
- يمكنك كتابة ملاحظة بعد التصنيف.
`.trim();

export function registerHelpCommand(bot: Bot): void {
  bot.command("help", async (ctx) => {
    await ctx.reply(helpMessage);
  });
}