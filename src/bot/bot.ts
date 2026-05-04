import { Bot } from "grammy";
import { SocksProxyAgent } from "socks-proxy-agent";
import { config } from "../config/env";

const socksAgent = new SocksProxyAgent("socks5h://127.0.0.1:12334");

export const bot = new Bot(config.botToken, {
  client: {
    baseFetchConfig: {
      agent: socksAgent,
      compress: true,
    } as any,
  },
});

bot.command("start", async (ctx) => {
  console.log("Received /start from:", ctx.from?.id);

  await ctx.reply("🚀 Welcome! Your finance bot is working.");
});

bot.on("message", async (ctx) => {
  console.log("Received message:", ctx.message.text);

  await ctx.reply("I received your message ✅");
});

bot.catch((err) => {
  console.error("Bot error:", err);
});