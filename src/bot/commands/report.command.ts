import { Bot, Context } from "grammy";
import {
  ReportPeriod,
  ReportService,
} from "../../application/services/report.service";
import { formatReport } from "../formatters/report.formatter";

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

    await ctx.reply(formatReport(report));
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