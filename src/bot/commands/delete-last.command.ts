import { Bot } from "grammy";
import { TransactionService } from "../../application/services/transaction.service";
import { TransactionDocument } from "../../infrastructure/database/models/transaction.model";

function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

function formatDeletedTransaction(transaction: TransactionDocument): string {
  const label = transaction.type === "income" ? "دخل" : "مصروف";
  const icon = transaction.type === "income" ? "💰" : "💸";
  const noteText = transaction.note ? `\nملاحظة: ${transaction.note}` : "";

  return (
    `${icon} تم حذف آخر ${label}\n\n` +
    `المبلغ: ${formatAmount(transaction.amount)}\n` +
    `التصنيف: ${transaction.category}` +
    noteText
  );
}

export function registerDeleteLastCommand(
  bot: Bot,
  transactionService: TransactionService
): void {
  bot.command("delete_last", async (ctx) => {
    const telegramUser = ctx.from;

    if (!telegramUser) {
      await ctx.reply("لم أستطع قراءة بيانات المستخدم.");
      return;
    }

    try {
      const deletedTransaction =
        await transactionService.deleteLastTransaction(telegramUser.id);

      await ctx.reply(formatDeletedTransaction(deletedTransaction));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "حدث خطأ غير متوقع.";

      await ctx.reply(`❌ ${message}`);
    }
  });
}