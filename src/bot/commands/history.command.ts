import { Bot } from "grammy";
import { HistoryService } from "../../application/services/history.service";
import { TransactionDocument } from "../../infrastructure/database/models/transaction.model";

function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

function formatTransaction(transaction: TransactionDocument, index: number): string {
  const icon = transaction.type === "income" ? "💰" : "💸";
  const label = transaction.type === "income" ? "دخل" : "مصروف";

  const noteText = transaction.note ? `\n   ملاحظة: ${transaction.note}` : "";

  return (
    `${index + 1}. ${icon} ${label} | ` +
    `${formatAmount(transaction.amount)} | ` +
    `${transaction.category}` +
    noteText
  );
}

function parseHistoryLimit(text: string | undefined): number {
    if (!text) {
        return 5;
    }

    const parts = text.trim().split(/\s+/);
    const limitText = parts[1];

    if (!limitText) {
        return 5;
    }

    const limit = Number(limitText);

    if (!Number.isInteger(limit) || limit <= 0) {
        return 5;
    }

    return limit;
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

    try {
        const limit = parseHistoryLimit(ctx.message?.text);

        const transactions = await historyService.getRecentTransactions(
        telegramUser.id,
        limit
        );

        if (transactions.length === 0) {
            await ctx.reply(
            "لا توجد عمليات بعد.\n\nجرّب إضافة دخل أو مصروف:\n/income 1000 salary\n/expense 250 food"
            );
            return;
        }

        const historyText = transactions
            .map((transaction, index) => formatTransaction(transaction, index))
            .join("\n\n");

        await ctx.reply(`🧾 آخر ${transactions.length} عملية\n\n` + historyText);
        } catch (error) {
        const message =
            error instanceof Error ? error.message : "حدث خطأ غير متوقع.";

        await ctx.reply(`❌ ${message}`);
        }
    });
}