import { Bot } from "grammy";

const helpMessage = `
👋 أهلاً بك في بوت إدارة المصاريف

الأوامر المتاحة:

/start
تسجيل المستخدم وتشغيل البوت

/help
عرض هذه المساعدة

/income (amount) (category) (history) (note) 
إضافة دخل
مثال:
/income 5000 salary 2026-05-05

/expense (amount) (category) (history) (note)
إضافة مصروف
مثال:
/expense 250 food lunch 2026-05-05 lunch with friends

ملاحظات:
- التاريخ اختياري.
- إذا لم تكتب التاريخ، سيتم استخدام تاريخ اليوم تلقائيًا.
- صيغة التاريخ: YYYY-MM-DD
- الملاحظة اختيارية أيضا

____________________________________________________

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

____________________________________________________

/history
عرض آخر 5 عمليات

/history 10
عرض آخر 10 عمليات، والحد الأقصى 20

/history 2026-05-04
عرض عمليات يوم محدد

/history_day
عرض عمليات اليوم

/history_week
عرض عمليات الأسبوع الحالي

/history_month
عرض عمليات الشهر الحالي

/history_year
عرض عمليات السنة الحالية
/delete_last
حذف آخر عملية قمت بإضافتها

____________________________________________________

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