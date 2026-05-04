import { Bot } from "grammy";
import { UserService } from "../../application/services/user.service";

type RegisterTelegramUserData = {
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
};

export function registerStartCommand(bot: Bot, userService: UserService): void {
  bot.command("start", async (ctx) => {
    const telegramUser = ctx.from;

    if (!telegramUser) {
      await ctx.reply("لم أستطع قراءة بيانات المستخدم.");
      return;
    }

    const userData: RegisterTelegramUserData = {
      telegramId: telegramUser.id,
      firstName: telegramUser.first_name,
    };

    if (telegramUser.username) {
      userData.username = telegramUser.username;
    }

    if (telegramUser.last_name) {
      userData.lastName = telegramUser.last_name;
    }

    await userService.registerTelegramUser(userData);

    await ctx.reply(
      "أهلًا بك 👋\nتم تسجيلك في بوت المصاريف.\n\nالخطوة القادمة: إضافة الدخل والمصاريف."
    );
  });
}