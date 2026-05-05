import { Bot } from "grammy";
import { UserService } from "../../application/services/user.service";
import { BotContext } from "../context";
import {
    createLanguageKeyboard,
  getLanguageFromCallback,
  languageCallbacks,
} from "../keyboards/language.keyboard";
import {
  createMainMenuKeyboard,
  mainMenuButtons,
} from "../keyboards/main-menu.keyboard";
import { SupportedLanguage } from "../i18n/language";

function getLanguageSelectedMessage(language: SupportedLanguage): string {
  if (language === "ar") {
    return "تم اختيار اللغة العربية ✅";
  }

  if (language === "ru") {
    return "Русский язык выбран ✅";
  }

  return "English selected ✅";
}

async function askForLanguage(ctx: BotContext): Promise<void> {
  await ctx.reply("اختر اللغة / Выберите язык / Choose language:", {
    reply_markup: createLanguageKeyboard(),
  });
}

export function registerLanguageCommand(
  bot: Bot<BotContext>,
  userService: UserService
): void {

    bot.command("language", async (ctx) => {
    await askForLanguage(ctx);
  });

  bot.hears(mainMenuButtons.language, async (ctx) => {
    await askForLanguage(ctx);
  });
  
  bot.callbackQuery(
    [
      languageCallbacks.ar,
      languageCallbacks.ru,
      languageCallbacks.en,
    ],
    async (ctx) => {
      await ctx.answerCallbackQuery();

      const language = getLanguageFromCallback(ctx.callbackQuery.data);

      if (!language) {
        await ctx.reply("Unsupported language.");
        return;
      }

      await userService.setUserLanguage(ctx.from.id, language);

      await ctx.reply(
        getLanguageSelectedMessage(language) +
          "\n\nيمكنك الآن استخدام البوت من القائمة.",
        {
          reply_markup: createMainMenuKeyboard(),
        }
      );
    }
  );
}