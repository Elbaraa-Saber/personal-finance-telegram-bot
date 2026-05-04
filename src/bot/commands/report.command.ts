import { Bot } from "grammy";
import { ReportService } from "../../application/services/report.service";

function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

export function registerReportCommand(
  bot: Bot,
  reportService: ReportService
): void {
  bot.command("report", async (ctx) => {
    const telegramUser = ctx.from;

    if (!telegramUser) {
      await ctx.reply("لم أستطع قراءة بيانات المستخدم.");
      return;
    }

    try {
      const summary = await reportService.getUserSummary(telegramUser.id);

      await ctx.reply(
        "📊 تقريرك الحالي\n\n" +
          `إجمالي الدخل: ${formatAmount(summary.totalIncome)}\n` +
          `إجمالي المصروف: ${formatAmount(summary.totalExpense)}\n` +
          `الرصيد: ${formatAmount(summary.balance)}\n` +
          `عدد العمليات: ${summary.transactionCount}`
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "حدث خطأ غير متوقع.";

      await ctx.reply(`❌ ${message}`);
    }
  });
}