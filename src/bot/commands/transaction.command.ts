import { Bot } from "grammy";
import { TransactionService } from "../../application/services/transaction.service";
import { TransactionType } from "../../infrastructure/database/models/transaction.model";
import { BotContext } from "../context";

type ParsedTransactionCommand = {
  amount: number;
  category: string;
  note?: string;
  transactionDate?: Date;
};

function isDateText(text: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(text);
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

function parseTransactionCommand(text: string): ParsedTransactionCommand | null {
  const parts = text.trim().split(/\s+/);

  const amountText = parts[1];
  const category = parts[2];

  if (!amountText || !category) {
    return null;
  }

  const amount = Number(amountText);

  if (Number.isNaN(amount) || amount <= 0) {
    return null;
  }

  const possibleDate = parts[3];

  if (possibleDate && isDateText(possibleDate)) {
    const transactionDate = parseDate(possibleDate);

    if (!transactionDate) {
      return null;
    }

    const noteParts = parts.slice(4);

    return {
      amount,
      category,
      transactionDate,
      ...(noteParts.length > 0 ? { note: noteParts.join(" ") } : {}),
    };
  }

  const noteParts = parts.slice(3);

  return {
    amount,
    category,
    ...(noteParts.length > 0 ? { note: noteParts.join(" ") } : {}),
  };
}

function registerTransactionCommand(
  bot: Bot<BotContext>,
  command: "income" | "expense",
  type: TransactionType,
  transactionService: TransactionService
): void {
  bot.command(command, async (ctx) => {
    const telegramUser = ctx.from;

    if (!telegramUser) {
      await ctx.reply("لم أستطع قراءة بيانات المستخدم.");
      return;
    }

    const text = ctx.message?.text;

    if (!text) {
      await ctx.reply("الأمر غير صحيح.");
      return;
    }

    const parsed = parseTransactionCommand(text);

    if (!parsed) {
      const example =
        command === "income"
          ? "/income 1000 salary"
          : "/expense 250 food";

      await ctx.reply(`اكتب الأمر بهذا الشكل:\n${example}`);
      return;
    }

    try {
      const transaction = await transactionService.addTransaction({
        telegramId: telegramUser.id,
        type,
        amount: parsed.amount,
        category: parsed.category,
        ...(parsed.note ? { note: parsed.note } : {}),
        ...(parsed.transactionDate
            ? { transactionDate: parsed.transactionDate }
            : {}),
      });

      const label = type === "income" ? "دخل" : "مصروف";

      await ctx.reply(
        `✅ تم إضافة ${label}\n` +
          `المبلغ: ${transaction.amount}\n` +
          `التصنيف: ${transaction.category}`
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "حدث خطأ غير متوقع.";

      await ctx.reply(`❌ ${message}`);
    }
  });
}

export function registerTransactionCommands(
  bot: Bot<BotContext>,
  transactionService: TransactionService
): void {
  registerTransactionCommand(bot, "income", "income", transactionService);
  registerTransactionCommand(bot, "expense", "expense", transactionService);
}