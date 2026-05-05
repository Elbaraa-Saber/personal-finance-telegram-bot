import { session, Bot } from "grammy";
import { SocksProxyAgent } from "socks-proxy-agent";
import { config } from "../config/env";
import { BotContext, createInitialSession } from "./context";

export function createBot(): Bot<BotContext> {
  const botOptions = config.useProxy
    ? {
        client: {
          baseFetchConfig: {
            agent: new SocksProxyAgent(config.socksProxyUrl!),
            compress: true,
          } as any,
        },
      }
    : undefined;

  const bot = new Bot<BotContext>(config.botToken, botOptions as any);

  bot.catch((error) => {
    console.error("❌ Bot error:", error);
  });

  bot.use(
    session({
      initial: createInitialSession,
    })
  );
  return bot;
}