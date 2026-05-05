import { Bot, Context } from "grammy";
import {
  ReportPeriod,
  ReportService,
} from "../../application/services/report.service";
import { HistoryService } from "../../application/services/history.service";
import { createMainMenuKeyboard, getMainMenuButtonTexts } from "../keyboards/main-menu.keyboard";
import { formatReport } from "../formatters/report.formatter";
import { formatTransactionLine } from "../formatters/transaction.formatter";
import { BotContext } from "../context";
import { UserService } from "../../application/services/user.service";
import { getMessages } from "../i18n/translations";
import { config } from "../../config/env";
import { askForLanguage } from "./language.command";
import { askForCurrency } from "./currency.command";
import {
  createReportOptionsKeyboard,
  reportOptionCallbacks,
} from "../keyboards/report-options.keyboard";
import {
  createSettingsOptionsKeyboard,
  settingsOptionCallbacks,
} from "../keyboards/settings-options.keyboard";

async function replyWithReport(
  ctx: Context,
  reportService: ReportService,
  userService: UserService,
  period: ReportPeriod
): Promise<void> {
  const telegramUser = ctx.from;

  if (!telegramUser) {
    await ctx.reply(getMessages().common.readUserError);
    return;
  }

  const language = await userService.getUserLanguage(telegramUser.id);
  const currency = await userService.getUserCurrency(telegramUser.id);
  const messages = getMessages(language);

  try {
    const language = await userService.getUserLanguage(telegramUser.id);

    const report = await reportService.getUserSummaryForPeriod(
      telegramUser.id,
      period
    );

    await ctx.reply(formatReport(report, language, currency));
  } catch (error) {
    const message =
        error instanceof Error ? error.message : messages.common.unexpectedError;

    await ctx.reply(`❌ ${message}`);
  }
}

async function replyWithRecentHistory(
  ctx: Context,
  historyService: HistoryService,
  userService: UserService
): Promise<void> {
  const telegramUser = ctx.from;

  if (!telegramUser) {
    await ctx.reply(getMessages().common.readUserError);
    return;
  }
  const language = await userService.getUserLanguage(telegramUser.id);
  const currency = await userService.getUserCurrency(telegramUser.id);
  const messages = getMessages(language);

  try {
    const transactions = await historyService.getRecentTransactions(
      telegramUser.id,
      5
    );

    if (transactions.length === 0) {
      await ctx.reply(messages.history.empty);
      return;
    }

    const historyText = transactions
        .map((transaction, index) =>
            formatTransactionLine(transaction, index, language, currency)
        )
        .join("\n\n");

    await ctx.reply(
        `${messages.history.titles.recent(transactions.length)}\n\n${historyText}`
    );
  } catch (error) {
    const message =
        error instanceof Error ? error.message : messages.common.unexpectedError;

    await ctx.reply(`❌ ${message}`);
  }
}

export function registerMenuCommandHandlers(
  bot: Bot<BotContext>,
  reportService: ReportService,
  historyService: HistoryService,
  userService: UserService
): void {

  bot.hears(getMainMenuButtonTexts("history"), async (ctx) => {
    await replyWithRecentHistory(ctx, historyService, userService);
  });

  bot.hears(getMainMenuButtonTexts("reportDay"), async (ctx) => {
    await replyWithReport(ctx, reportService, userService, "day");
  });

  bot.hears(getMainMenuButtonTexts("moreReports"), async (ctx) => {
    const telegramUser = ctx.from;

    if (!telegramUser) {
        await ctx.reply(getMessages().common.readUserError);
        return;
    }

    const language = await userService.getUserLanguage(telegramUser.id);

    await ctx.reply(getMessages(language).menu.moreReports, {
        reply_markup: createReportOptionsKeyboard(language),
    });
  });

    bot.callbackQuery(reportOptionCallbacks.all, async (ctx) => {
    await ctx.answerCallbackQuery();
    await replyWithReport(ctx, reportService, userService, "all");
    });

    bot.callbackQuery(reportOptionCallbacks.week, async (ctx) => {
    await ctx.answerCallbackQuery();
    await replyWithReport(ctx, reportService, userService, "week");
    });

    bot.callbackQuery(reportOptionCallbacks.month, async (ctx) => {
    await ctx.answerCallbackQuery();
    await replyWithReport(ctx, reportService, userService, "month");
    });

    bot.callbackQuery(reportOptionCallbacks.year, async (ctx) => {
    await ctx.answerCallbackQuery();
    await replyWithReport(ctx, reportService, userService, "year");
    });

    bot.hears(getMainMenuButtonTexts("settings"), async (ctx) => {
        const telegramUser = ctx.from;

        if (!telegramUser) {
            await ctx.reply(getMessages().common.readUserError);
            return;
        }

        const language = await userService.getUserLanguage(telegramUser.id);

        await ctx.reply(getMessages(language).menu.settings, {
            reply_markup: createSettingsOptionsKeyboard(language),
        });
    });

    bot.callbackQuery(settingsOptionCallbacks.language, async (ctx) => {
        await ctx.answerCallbackQuery();
        await askForLanguage(ctx);
    });

        bot.callbackQuery(settingsOptionCallbacks.currency, async (ctx) => {
        await ctx.answerCallbackQuery();
        await askForCurrency(ctx, userService);
    });

    bot.hears(getMainMenuButtonTexts("help"), async (ctx) => {
    const telegramUser = ctx.from;

    if (!telegramUser) {
        await ctx.reply(getMessages().common.readUserError);
        return;
    }

    const language = await userService.getUserLanguage(telegramUser.id);
    const currency = await userService.getUserCurrency(telegramUser.id);
    const messages = getMessages(language);

    await ctx.reply(messages.help.text(currency), {
        reply_markup: createMainMenuKeyboard(language),
    });
    });
}