import { Bot, Context } from "grammy";
import {
  ReportPeriod,
  ReportService,
} from "../../application/services/report.service";

function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

async function replyWithReport(
  ctx: Context,
  reportService: ReportService,
  period: ReportPeriod
): Promise<void> {
  const telegramUser = ctx.from;

  if (!telegramUser) {
    await ctx.reply("لم أستطع قراءة بيانات المستخدم.");
    return;
  }

  try {
    const report = await reportService.getUserSummaryForPeriod(
      telegramUser.id,
      period
    );

    await ctx.reply(
      `${report.title}\n\n` +
        `إجمالي الدخل: ${formatAmount(report.totalIncome)}\n` +
        `إجمالي المصروف: ${formatAmount(report.totalExpense)}\n` +
        `الرصيد: ${formatAmount(report.balance)}\n` +
        `عدد العمليات: ${report.transactionCount}`
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "حدث خطأ غير متوقع.";

    await ctx.reply(`❌ ${message}`);
  }
}

export function registerReportCommand(
  bot: Bot,
  reportService: ReportService
): void {
  bot.command("report", async (ctx) => {
    await replyWithReport(ctx, reportService, "all");
  });

  bot.command("report_day", async (ctx) => {
    await replyWithReport(ctx, reportService, "day");
  });

  bot.command("report_week", async (ctx) => {
    await replyWithReport(ctx, reportService, "week");
  });

  bot.command("report_month", async (ctx) => {
    await replyWithReport(ctx, reportService, "month");
  });

  bot.command("report_year", async (ctx) => {
    await replyWithReport(ctx, reportService, "year");
  });
}