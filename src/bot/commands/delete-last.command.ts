import { Bot, Context } from "grammy";
import { TransactionService } from "../../application/services/transaction.service";
import { TransactionDocument } from "../../infrastructure/database/models/transaction.model";
import { mainMenuButtons } from "../keyboards/main-menu.keyboard";
import {
  createDeleteConfirmationKeyboard,
  deleteConfirmationCallbacks,
} from "../keyboards/delete-confirmation.keyboard";

function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDeletedTransaction(transaction: TransactionDocument): string {
  const label = transaction.type === "income" ? "دخل" : "مصروف";
  const icon = transaction.type === "income" ? "💰" : "💸";
  const noteText = transaction.note ? `\nملاحظة: ${transaction.note}` : "";

  return (
    `${icon} تم حذف آخر ${label}\n\n` +
    `المبلغ: ${formatAmount(transaction.amount)}\n` +
    `التصنيف: ${transaction.category}\n` +
    `التاريخ: ${formatDate(transaction.transactionDate)}` +
    noteText
  );
}

async function askDeleteConfirmation(ctx: Context): Promise<void> {
  await ctx.reply("هل أنت متأكد أنك تريد حذف آخر عملية؟", {
    reply_markup: createDeleteConfirmationKeyboard(),
  });
}

export function registerDeleteLastCommand(
  bot: Bot,
  transactionService: TransactionService
): void {
  bot.command("delete_last", async (ctx) => {
    await askDeleteConfirmation(ctx);
  });

  bot.hears(mainMenuButtons.deleteLast, async (ctx) => {
    await askDeleteConfirmation(ctx);
  });

  bot.callbackQuery(
    deleteConfirmationCallbacks.cancelDeleteLast,
    async (ctx) => {
      await ctx.answerCallbackQuery();

      await ctx.editMessageText("تم إلغاء الحذف.");
    }
  );

  bot.callbackQuery(
    deleteConfirmationCallbacks.confirmDeleteLast,
    async (ctx) => {
      await ctx.answerCallbackQuery();

      const telegramUser = ctx.from;

      if (!telegramUser) {
        await ctx.editMessageText("لم أستطع قراءة بيانات المستخدم.");
        return;
      }

      try {
        const deletedTransaction =
          await transactionService.deleteLastTransaction(telegramUser.id);

        await ctx.editMessageText(formatDeletedTransaction(deletedTransaction));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "حدث خطأ غير متوقع.";

        await ctx.editMessageText(`❌ ${message}`);
      }
    }
  );
}