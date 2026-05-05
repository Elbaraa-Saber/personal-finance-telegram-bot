import { Bot } from "grammy";
import { TransactionService } from "../../application/services/transaction.service";
import { TransactionType } from "../../infrastructure/database/models/transaction.model";
import { BotContext } from "../context";
import { UserService } from "../../application/services/user.service";
import {
  createMainMenuKeyboard,
  getMainMenuButtonTexts,
  isMainMenuButtonText,
} from "../keyboards/main-menu.keyboard";
import { formatCreatedTransaction } from "../formatters/transaction.formatter";
import {
  createCancelFlowKeyboard,
  getCancelFlowButtonTexts,
  isCancelFlowButtonText,
} from "../keyboards/cancel-flow.keyboard";
import { getMessages } from "../i18n/translations";
import { defaultLanguage, SupportedLanguage } from "../i18n/language";

function parseAmount(text: string): number | null {
  const amount = Number(text.replace(",", "."));

  if (Number.isNaN(amount) || amount <= 0) {
    return null;
  }

  return amount;
}

function isSkipText(text: string): boolean {
  const normalizedText = text.trim().toLowerCase();

  return (
    normalizedText === "-" ||
    normalizedText === "skip" ||
    normalizedText === "لا"
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

function getTransactionLabel(
  type: TransactionType,
  language: SupportedLanguage
): string {
  const messages = getMessages(language);

  return type === "income"
    ? messages.transaction.income
    : messages.transaction.expense;
}

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

async function startTransactionFlow(
  ctx: BotContext,
  type: TransactionType,
  userService: UserService
): Promise<void> {
  const telegramUser = ctx.from;

  if (!telegramUser) {
    await ctx.reply(getMessages().transactionFlow.readUserError);
    return;
  }

  const language = await userService.getUserLanguage(telegramUser.id);
  const messages = getMessages(language);
  const label = getTransactionLabel(type, language);

  ctx.session.pendingTransaction = {
    type,
    step: "amount",
  };

  await ctx.reply(messages.transactionFlow.start(label), {
    reply_markup: createCancelFlowKeyboard(language),
  });
}

async function cancelTransactionFlow(
  ctx: BotContext,
  userService: UserService
): Promise<void> {
  const language = await getLanguageForContext(ctx, userService);
  const messages = getMessages(language);

  if (!ctx.session.pendingTransaction) {
    await ctx.reply(messages.transactionFlow.noActiveFlow, {
      reply_markup: createMainMenuKeyboard(language),
    });
    return;
  }

  ctx.session.pendingTransaction = null;

  await ctx.reply(messages.transactionFlow.cancelled, {
    reply_markup: createMainMenuKeyboard(language),
  });
}

function isCommandText(text: string): boolean {
  return text.startsWith("/");
}

function shouldBlockDuringTransactionFlow(text: string): boolean {
  if (isCancelFlowButtonText(text)) {
    return false;
  }

  return isCommandText(text) || isMainMenuButtonText(text);
}

async function replyWithActiveFlowWarning(
  ctx: BotContext,
  language: SupportedLanguage
): Promise<void> {
  const messages = getMessages(language);

  await ctx.reply(messages.transactionFlow.activeFlowWarning, {
    reply_markup: createCancelFlowKeyboard(language),
  });
}

export function registerTransactionFlowCommand(
  bot: Bot<BotContext>,
  transactionService: TransactionService,
  userService: UserService
): void {
  bot.hears(getMainMenuButtonTexts("addIncome"), async (ctx) => {
    await startTransactionFlow(ctx, "income", userService);
  });

  bot.hears(getMainMenuButtonTexts("addExpense"), async (ctx) => {
    await startTransactionFlow(ctx, "expense", userService);
  });

  bot.command("cancel", async (ctx) => {
    await cancelTransactionFlow(ctx, userService);
  });

  bot.hears(getCancelFlowButtonTexts(), async (ctx) => {
    await cancelTransactionFlow(ctx, userService);
  });

  bot.on("message:text", async (ctx, next) => {
    const pendingTransaction = ctx.session.pendingTransaction;

    if (!pendingTransaction) {
      await next();
      return;
    }

    const telegramUser = ctx.from;

    if (!telegramUser) {
      ctx.session.pendingTransaction = null;
      await ctx.reply(getMessages().transactionFlow.readUserError);
      return;
    }

    const language = await userService.getUserLanguage(telegramUser.id);
    const currency = await userService.getUserCurrency(telegramUser.id);
    const messages = getMessages(language);
    const text = ctx.message.text.trim();

    if (text === "/cancel" || isCancelFlowButtonText(text)) {
      await cancelTransactionFlow(ctx, userService);
      return;
    }

    if (shouldBlockDuringTransactionFlow(text)) {
      await replyWithActiveFlowWarning(ctx, language);
      return;
    }

    if (pendingTransaction.step === "amount") {
      const amount = parseAmount(text);

      if (!amount) {
        await ctx.reply(messages.transactionFlow.invalidAmount, {
          reply_markup: createCancelFlowKeyboard(language),
        });
        return;
      }

      ctx.session.pendingTransaction = {
        ...pendingTransaction,
        amount,
        step: "category",
      };

      await ctx.reply(messages.transactionFlow.askCategory, {
        reply_markup: createCancelFlowKeyboard(language),
      });
      return;
    }

    if (pendingTransaction.step === "category") {
      if (!text) {
        await ctx.reply(messages.transactionFlow.emptyCategory, {
          reply_markup: createCancelFlowKeyboard(language),
        });
        return;
      }

      ctx.session.pendingTransaction = {
        ...pendingTransaction,
        category: text,
        step: "date",
      };

      await ctx.reply(messages.transactionFlow.askDate, {
        reply_markup: createCancelFlowKeyboard(language),
      });
      return;
    }

    if (pendingTransaction.step === "date") {
      if (isSkipText(text)) {
        ctx.session.pendingTransaction = {
          ...pendingTransaction,
          step: "note",
        };

        await ctx.reply(messages.transactionFlow.askNote, {
          reply_markup: createCancelFlowKeyboard(language),
        });
        return;
      }

      const transactionDate = parseDate(text);

      if (!transactionDate) {
        await ctx.reply(messages.transactionFlow.invalidDate, {
          reply_markup: createCancelFlowKeyboard(language),
        });
        return;
      }

      ctx.session.pendingTransaction = {
        ...pendingTransaction,
        transactionDateText: text,
        step: "note",
      };

      await ctx.reply(messages.transactionFlow.askNote, {
        reply_markup: createCancelFlowKeyboard(language),
      });
      return;
    }

    if (pendingTransaction.step === "note") {
      const amount = pendingTransaction.amount;
      const category = pendingTransaction.category;

      if (!amount || !category) {
        ctx.session.pendingTransaction = null;

        await ctx.reply(messages.transactionFlow.dataError, {
          reply_markup: createMainMenuKeyboard(language),
        });
        return;
      }

      const transactionDate = pendingTransaction.transactionDateText
        ? parseDate(pendingTransaction.transactionDateText)
        : null;

      try {
        const transaction = await transactionService.addTransaction({
          telegramId: telegramUser.id,
          type: pendingTransaction.type,
          amount,
          category,
          ...(transactionDate ? { transactionDate } : {}),
          ...(!isSkipText(text) ? { note: text } : {}),
        });

        ctx.session.pendingTransaction = null;

        await ctx.reply(formatCreatedTransaction(transaction, language, currency), {
          reply_markup: createMainMenuKeyboard(language),
        });
      } catch (error) {
        ctx.session.pendingTransaction = null;

        const message =
            error instanceof Error ? error.message : messages.common.unexpectedError;

        await ctx.reply(`❌ ${message}`, {
          reply_markup: createMainMenuKeyboard(language),
        });
      }
    }
  });
}