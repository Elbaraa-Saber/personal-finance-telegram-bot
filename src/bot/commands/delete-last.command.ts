import { Bot } from "grammy";
import { TransactionService } from "../../application/services/transaction.service";
import { TransactionDocument } from "../../infrastructure/database/models/transaction.model";
import { mainMenuButtons } from "../keyboards/main-menu.keyboard";
import {
  createDeleteConfirmationKeyboard,
  deleteConfirmationCallbacks,
} from "../keyboards/delete-confirmation.keyboard";
import { formatDeletedTransaction } from "../formatters/transaction.formatter";
import { BotContext } from "../context";


async function askDeleteConfirmation(ctx: BotContext): Promise<void> {
  await ctx.reply("هل أنت متأكد أنك تريد حذف آخر عملية؟", {
    reply_markup: createDeleteConfirmationKeyboard(),
  });
}

export function registerDeleteLastCommand(
  bot: Bot<BotContext>,
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