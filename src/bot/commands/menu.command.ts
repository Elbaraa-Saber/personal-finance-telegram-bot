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

async function replyWithReport(
  ctx: Context,
  reportService: ReportService,
  period: ReportPeriod
): Promise<void> {
  const telegramUser = ctx.from;

  if (!telegramUser) {
    await ctx.reply("لم أستطع قراءة بيانات المستخدم.");
    return;
  }

  try {
    const report = await reportService.getUserSummaryForPeriod(
      telegramUser.id,
      period
    );

    await ctx.reply(formatReport(report));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "حدث خطأ غير متوقع.";

    await ctx.reply(`❌ ${message}`);
  }
}

async function replyWithRecentHistory(
  ctx: Context,
  historyService: HistoryService
): Promise<void> {
  const telegramUser = ctx.from;

  if (!telegramUser) {
    await ctx.reply("لم أستطع قراءة بيانات المستخدم.");
    return;
  }

  try {
    const transactions = await historyService.getRecentTransactions(
      telegramUser.id,
      5
    );

    if (transactions.length === 0) {
      await ctx.reply("لا توجد عمليات بعد.");
      return;
    }

    const historyText = transactions
      .map((transaction, index) => formatTransactionLine(transaction, index))
      .join("\n\n");

    await ctx.reply(`🧾 آخر ${transactions.length} عملية\n\n${historyText}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "حدث خطأ غير متوقع.";

    await ctx.reply(`❌ ${message}`);
  }
}

export function registerMenuCommandHandlers(
  bot: Bot<BotContext>,
  reportService: ReportService,
  historyService: HistoryService,
  userService: UserService
): void {
  bot.hears(getMainMenuButtonTexts("reportAll"), async (ctx) => {
    await replyWithReport(ctx, reportService, "all");
  });

  bot.hears(getMainMenuButtonTexts("reportDay"), async (ctx) => {
    await replyWithReport(ctx, reportService, "day");
  });

  bot.hears(getMainMenuButtonTexts("reportWeek"), async (ctx) => {
    await replyWithReport(ctx, reportService, "week");
  });

  bot.hears(getMainMenuButtonTexts("reportMonth"), async (ctx) => {
    await replyWithReport(ctx, reportService, "month");
  });

  bot.hears(getMainMenuButtonTexts("reportYear"), async (ctx) => {
    await replyWithReport(ctx, reportService, "year");
  });

  bot.hears(getMainMenuButtonTexts("history"), async (ctx) => {
    await replyWithRecentHistory(ctx, historyService);
  });

   bot.hears(getMainMenuButtonTexts("help"), async (ctx) => {
        const telegramUser = ctx.from;

        if (!telegramUser) {
            await ctx.reply("لم أستطع قراءة بيانات المستخدم.");
            return;
        }

        const language = await userService.getUserLanguage(telegramUser.id);
        const messages = getMessages(language);

        await ctx.reply(messages.help.text(config.defaultCurrency), {
            reply_markup: createMainMenuKeyboard(language),
        });
    });
}