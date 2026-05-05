import { Bot, Context } from "grammy";
import {
  ReportPeriod,
  ReportService,
} from "../../application/services/report.service";
import { HistoryService } from "../../application/services/history.service";
import { TransactionDocument } from "../../infrastructure/database/models/transaction.model";
import { mainMenuButtons } from "../keyboards/main-menu.keyboard";

function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTransaction(
  transaction: TransactionDocument,
  index: number
): string {
  const icon = transaction.type === "income" ? "💰" : "💸";
  const label = transaction.type === "income" ? "دخل" : "مصروف";
  const noteText = transaction.note ? `\n   ملاحظة: ${transaction.note}` : "";

  return (
    `${index + 1}. ${icon} ${label} | ` +
    `${formatAmount(transaction.amount)} | ` +
    `${transaction.category} | ` +
    `${formatDate(transaction.transactionDate)}` +
    noteText
  );
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

async function replyWithRecentHistory(
  ctx: Context,
  historyService: HistoryService
): Promise<void> {
  const telegramUser = ctx.from;

  if (!telegramUser) {
    await ctx.reply("لم أستطع قراءة بيانات المستخدم.");
    return;
  }

  try {
    const transactions = await historyService.getRecentTransactions(
      telegramUser.id,
      5
    );

    if (transactions.length === 0) {
      await ctx.reply("لا توجد عمليات بعد.");
      return;
    }

    const historyText = transactions
      .map((transaction, index) => formatTransaction(transaction, index))
      .join("\n\n");

    await ctx.reply(`🧾 آخر ${transactions.length} عملية\n\n${historyText}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "حدث خطأ غير متوقع.";

    await ctx.reply(`❌ ${message}`);
  }
}

export function registerMenuCommandHandlers(
  bot: Bot,
  reportService: ReportService,
  historyService: HistoryService
): void {
  bot.hears(mainMenuButtons.reportAll, async (ctx) => {
    await replyWithReport(ctx, reportService, "all");
  });

  bot.hears(mainMenuButtons.reportDay, async (ctx) => {
    await replyWithReport(ctx, reportService, "day");
  });

  bot.hears(mainMenuButtons.reportWeek, async (ctx) => {
    await replyWithReport(ctx, reportService, "week");
  });

  bot.hears(mainMenuButtons.reportMonth, async (ctx) => {
    await replyWithReport(ctx, reportService, "month");
  });

  bot.hears(mainMenuButtons.reportYear, async (ctx) => {
    await replyWithReport(ctx, reportService, "year");
  });

  bot.hears(mainMenuButtons.history, async (ctx) => {
    await replyWithRecentHistory(ctx, historyService);
  });

  bot.hears(mainMenuButtons.help, async (ctx) => {
    await ctx.reply(
      "اكتب /help لعرض كل الأوامر المتاحة.\n\n" +
        "يمكنك أيضًا استخدام الأزرار بالأسفل للتقارير وآخر العمليات."
    );
  });
}