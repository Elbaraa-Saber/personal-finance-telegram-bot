import { Bot, Context } from "grammy";
import {
  HistoryPeriod,
  HistoryService,
} from "../../application/services/history.service";
import { TransactionDocument } from "../../infrastructure/database/models/transaction.model";

type ParsedHistoryArgument =
  | { type: "default" }
  | { type: "limit"; limit: number }
  | { type: "date"; date: Date }
  | { type: "invalid" };

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

function parseDate(text: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);

  if (!match) {
    return null;
  }

  const yearText = match[1];
  const monthText = match[2];
  const dayText = match[3];

  if (!yearText || !monthText || !dayText) {
    return null;
  }

  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  const date = new Date(Date.UTC(year, month - 1, day));

  const isValidDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  return isValidDate ? date : null;
}

function parseHistoryArgument(text: string | undefined): ParsedHistoryArgument {
  if (!text) {
    return { type: "default" };
  }

  const parts = text.trim().split(/\s+/);
  const argument = parts[1];

  if (!argument) {
    return { type: "default" };
  }

  const limit = Number(argument);

  if (Number.isInteger(limit) && limit > 0) {
    return {
      type: "limit",
      limit,
    };
  }

  const date = parseDate(argument);

  if (date) {
    return {
      type: "date",
      date,
    };
  }

  return { type: "invalid" };
}

async function replyWithTransactions(
  ctx: Context,
  title: string,
  transactions: TransactionDocument[]
): Promise<void> {
  if (transactions.length === 0) {
    await ctx.reply(
      `${title}\n\nلا توجد عمليات في هذه الفترة.`
    );
    return;
  }

  const historyText = transactions
    .map((transaction, index) => formatTransaction(transaction, index))
    .join("\n\n");

  await ctx.reply(`${title}\n\n${historyText}`);
}

async function replyWithPeriodHistory(
  ctx: Context,
  historyService: HistoryService,
  period: HistoryPeriod,
  title: string
): Promise<void> {
  const telegramUser = ctx.from;

  if (!telegramUser) {
    await ctx.reply("لم أستطع قراءة بيانات المستخدم.");
    return;
  }

  try {
    const transactions = await historyService.getTransactionsForPeriod(
      telegramUser.id,
      period
    );

    await replyWithTransactions(ctx, title, transactions);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "حدث خطأ غير متوقع.";

    await ctx.reply(`❌ ${message}`);
  }
}

export function registerHistoryCommand(
  bot: Bot,
  historyService: HistoryService
): void {
  bot.command("history", async (ctx) => {
    const telegramUser = ctx.from;

    if (!telegramUser) {
      await ctx.reply("لم أستطع قراءة بيانات المستخدم.");
      return;
    }

    const parsedArgument = parseHistoryArgument(ctx.message?.text);

    if (parsedArgument.type === "invalid") {
      await ctx.reply(
        "استخدم الأمر بهذا الشكل:\n" +
          "/history\n" +
          "/history 10\n" +
          "/history 2026-05-04"
      );
      return;
    }

    try {
      if (parsedArgument.type === "limit") {
        const transactions = await historyService.getRecentTransactions(
          telegramUser.id,
          parsedArgument.limit
        );

        await replyWithTransactions(
          ctx,
          `🧾 آخر ${transactions.length} عملية`,
          transactions
        );
        return;
      }

      if (parsedArgument.type === "date") {
        const transactions = await historyService.getTransactionsForDate(
          telegramUser.id,
          parsedArgument.date
        );

        await replyWithTransactions(
          ctx,
          `🧾 عمليات يوم ${formatDate(parsedArgument.date)}`,
          transactions
        );
        return;
      }

      const transactions = await historyService.getRecentTransactions(
        telegramUser.id
      );

      await replyWithTransactions(
        ctx,
        `🧾 آخر ${transactions.length} عملية`,
        transactions
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "حدث خطأ غير متوقع.";

      await ctx.reply(`❌ ${message}`);
    }
  });

  bot.command("history_day", async (ctx) => {
    await replyWithPeriodHistory(
      ctx,
      historyService,
      "day",
      "🧾 عمليات اليوم"
    );
  });

  bot.command("history_week", async (ctx) => {
    await replyWithPeriodHistory(
      ctx,
      historyService,
      "week",
      "🧾 عمليات هذا الأسبوع"
    );
  });

  bot.command("history_month", async (ctx) => {
    await replyWithPeriodHistory(
      ctx,
      historyService,
      "month",
      "🧾 عمليات هذا الشهر"
    );
  });

  bot.command("history_year", async (ctx) => {
    await replyWithPeriodHistory(
      ctx,
      historyService,
      "year",
      "🧾 عمليات هذه السنة"
    );
  });
}