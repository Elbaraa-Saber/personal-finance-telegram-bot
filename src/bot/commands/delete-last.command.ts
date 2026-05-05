import { Bot } from "grammy";
import { TransactionService } from "../../application/services/transaction.service";
import { UserService } from "../../application/services/user.service";
import { BotContext } from "../context";
import { defaultLanguage, SupportedLanguage } from "../i18n/language";
import { getMessages } from "../i18n/translations";
import { formatDeletedTransaction } from "../formatters/transaction.formatter";
import { getMainMenuButtonTexts } from "../keyboards/main-menu.keyboard";
import {
  createDeleteConfirmationKeyboard,
  deleteConfirmationCallbacks,
} from "../keyboards/delete-confirmation.keyboard";

async function getLanguageForContext(
  ctx: BotContext,
  userService: UserService
): Promise<SupportedLanguage> {
  const telegramUser = ctx.from;

  if (!telegramUser) {
    return defaultLanguage;
  }

  return userService.getUserLanguage(telegramUser.id);
}

async function askDeleteConfirmation(
  ctx: BotContext,
  userService: UserService
): Promise<void> {
  const language = await getLanguageForContext(ctx, userService);
  const messages = getMessages(language);

  await ctx.reply(messages.delete.confirmation, {
    reply_markup: createDeleteConfirmationKeyboard(language),
  });
}

export function registerDeleteLastCommand(
  bot: Bot<BotContext>,
  transactionService: TransactionService,
  userService: UserService
): void {
  bot.command("delete_last", async (ctx) => {
    await askDeleteConfirmation(ctx, userService);
  });

  bot.hears(getMainMenuButtonTexts("deleteLast"), async (ctx) => {
    await askDeleteConfirmation(ctx, userService);
  });

  bot.callbackQuery(
    deleteConfirmationCallbacks.cancelDeleteLast,
    async (ctx) => {
      await ctx.answerCallbackQuery();

      const language = await getLanguageForContext(ctx, userService);
      const messages = getMessages(language);

      await ctx.editMessageText(messages.delete.cancelled);
    }
  );

  bot.callbackQuery(
    deleteConfirmationCallbacks.confirmDeleteLast,
    async (ctx) => {
      await ctx.answerCallbackQuery();

      const telegramUser = ctx.from;
      const language = await getLanguageForContext(ctx, userService);
      const messages = getMessages(language);

      if (!telegramUser) {
        await ctx.editMessageText(messages.delete.readUserError);
        return;
      }

      try {
        const deletedTransaction =
          await transactionService.deleteLastTransaction(telegramUser.id);

        await ctx.editMessageText(
          formatDeletedTransaction(deletedTransaction, language)
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : messages.common.unexpectedError;

        await ctx.editMessageText(`❌ ${message}`);
      }
    }
  );
}