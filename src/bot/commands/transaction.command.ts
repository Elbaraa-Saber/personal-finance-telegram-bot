import { Bot } from "grammy";
import { TransactionService } from "../../application/services/transaction.service";
import { TransactionType } from "../../infrastructure/database/models/transaction.model";

type ParsedTransactionCommand = {
  amount: number;
  category: string;
  note?: string;
};

function parseTransactionCommand(text: string): ParsedTransactionCommand | null {
  const parts = text.trim().split(/\s+/);

  const amountText = parts[1];
  const category = parts[2];
  const noteParts = parts.slice(3);

  if (!amountText || !category) {
    return null;
  }

  const amount = Number(amountText);

  if (Number.isNaN(amount) || amount <= 0) {
    return null;
  }

  return {
    amount,
    category,
    ...(noteParts.length > 0 ? { note: noteParts.join(" ") } : {}),
  };
}

function registerTransactionCommand(
  bot: Bot,
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
  bot: Bot,
  transactionService: TransactionService
): void {
  registerTransactionCommand(bot, "income", "income", transactionService);
  registerTransactionCommand(bot, "expense", "expense", transactionService);
}