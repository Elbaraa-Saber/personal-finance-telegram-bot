import { Bot } from "grammy";
import { TransactionService } from "../../application/services/transaction.service";
import { TransactionType } from "../../infrastructure/database/models/transaction.model";
import { BotContext } from "../context";
import { mainMenuButtons } from "../keyboards/main-menu.keyboard";
import { formatCreatedTransaction } from "../formatters/transaction.formatter";
import { createMainMenuKeyboard } from "../keyboards/main-menu.keyboard";
import {
  cancelFlowButton,
  createCancelFlowKeyboard,
} from "../keyboards/cancel-flow.keyboard";

function parseAmount(text: string): number | null {
  const amount = Number(text.replace(",", "."));

  if (Number.isNaN(amount) || amount <= 0) {
    return null;
  }

  return amount;
}

function isSkipText(text: string): boolean {
  const normalizedText = text.trim().toLowerCase();

  return normalizedText === "-" || normalizedText === "skip" || normalizedText === "لا";
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

function getTransactionLabel(type: TransactionType): string {
  return type === "income" ? "دخل" : "مصروف";
}

async function startTransactionFlow(
  ctx: BotContext,
  type: TransactionType
): Promise<void> {
  ctx.session.pendingTransaction = {
    type,
    step: "amount",
  };

  await ctx.reply(
    `حسنًا، سنضيف ${getTransactionLabel(type)}.\n\n` +
      "اكتب المبلغ فقط، مثال:\n" +
      "1500",
    {
        reply_markup: createCancelFlowKeyboard(),
    }
  );
}

async function cancelTransactionFlow(ctx: BotContext): Promise<void> {
  if (!ctx.session.pendingTransaction) {
    await ctx.reply("لا توجد عملية جارية لإلغائها.", {
      reply_markup: createMainMenuKeyboard(),
    });
    return;
  }

  ctx.session.pendingTransaction = null;

  await ctx.reply("تم إلغاء العملية الحالية.", {
    reply_markup: createMainMenuKeyboard(),
  });
}

export function registerTransactionFlowCommand(
  bot: Bot<BotContext>,
  transactionService: TransactionService
): void {
  bot.hears(mainMenuButtons.addIncome, async (ctx) => {
    await startTransactionFlow(ctx, "income");
  });

  bot.hears(mainMenuButtons.addExpense, async (ctx) => {
    await startTransactionFlow(ctx, "expense");
  });

  bot.command("cancel", async (ctx) => {
    await cancelTransactionFlow(ctx);
  });

  bot.hears(cancelFlowButton, async (ctx) => {
        await cancelTransactionFlow(ctx);
  });

  bot.on("message:text", async (ctx, next) => {
    const pendingTransaction = ctx.session.pendingTransaction;

    if (!pendingTransaction) {
      await next();
      return;
    }

    const text = ctx.message.text.trim();

    if (text === "/cancel") {
      ctx.session.pendingTransaction = null;
      await ctx.reply("تم إلغاء العملية الحالية.");
      return;
    }

    if (pendingTransaction.step === "amount") {
      const amount = parseAmount(text);

      if (!amount) {
        await ctx.reply(
          "المبلغ غير صحيح.\n\n" +
            "اكتب رقمًا أكبر من صفر، مثال:\n" +
            "1500\n\n" +
            "أو اكتب /cancel للإلغاء.",
            {
                reply_markup: createCancelFlowKeyboard(),
            }
        );
        return;
      }

      ctx.session.pendingTransaction = {
        ...pendingTransaction,
        amount,
        step: "category",
      };

      await ctx.reply(
        "اكتب التصنيف، مثال:\n" +
          "salary\n" +
          "food\n" +
          "transport",
            {
                reply_markup: createCancelFlowKeyboard(),
            }
      );
      return;
    }

    if (pendingTransaction.step === "category") {
      if (!text) {
        await ctx.reply("التصنيف لا يمكن أن يكون فارغًا.");
        return;
      }

      ctx.session.pendingTransaction = {
        ...pendingTransaction,
        category: text,
        step: "date",
      };

      await ctx.reply(
        "اكتب تاريخ العملية بصيغة YYYY-MM-DD، مثال:\n" +
          "2026-05-05\n\n" +
          "أو اكتب - لاستخدام تاريخ اليوم.",
            {
                reply_markup: createCancelFlowKeyboard(),
            }
      );
      return;
    }

    if (pendingTransaction.step === "date") {
      if (isSkipText(text)) {
        ctx.session.pendingTransaction = {
          ...pendingTransaction,
          step: "note",
        };

        await ctx.reply(
          "اكتب ملاحظة للعملية، أو اكتب - بدون ملاحظة.",
            {
                reply_markup: createCancelFlowKeyboard(),
            }
        );
        return;
      }

      const transactionDate = parseDate(text);

      if (!transactionDate) {
        await ctx.reply(
          "صيغة التاريخ غير صحيحة.\n\n" +
            "اكتب التاريخ بهذا الشكل:\n" +
            "2026-05-05\n\n" +
            "أو اكتب - لاستخدام تاريخ اليوم."
        );
        return;
      }

      ctx.session.pendingTransaction = {
        ...pendingTransaction,
        transactionDateText: text,
        step: "note",
      };

      await ctx.reply(
        "اكتب ملاحظة للعملية، أو اكتب - بدون ملاحظة."
      );
      return;
    }

    if (pendingTransaction.step === "note") {
      const amount = pendingTransaction.amount;
      const category = pendingTransaction.category;

      if (!amount || !category) {
        ctx.session.pendingTransaction = null;
        await ctx.reply("حدث خطأ في بيانات العملية. ابدأ من جديد.");
        return;
      }

      const transactionDate = pendingTransaction.transactionDateText
        ? parseDate(pendingTransaction.transactionDateText)
        : null;

      try {
        const transaction = await transactionService.addTransaction({
          telegramId: ctx.from.id,
          type: pendingTransaction.type,
          amount,
          category,
          ...(transactionDate ? { transactionDate } : {}),
          ...(!isSkipText(text) ? { note: text } : {}),
        });

        ctx.session.pendingTransaction = null;

        await ctx.reply(formatCreatedTransaction(transaction), {
            reply_markup: createMainMenuKeyboard(),
        });
      } catch (error) {
        ctx.session.pendingTransaction = null;

        const message =
          error instanceof Error ? error.message : "حدث خطأ غير متوقع.";

        await ctx.reply(`❌ ${message}`, {
            reply_markup: createMainMenuKeyboard(),
        });      }
    }
  });
}