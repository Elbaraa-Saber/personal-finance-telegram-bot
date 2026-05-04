import { Bot } from "grammy";
import { SocksProxyAgent } from "socks-proxy-agent";
import { config } from "../config/env";

export function createBot(): Bot {
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

  const bot = new Bot(config.botToken, botOptions as any);

  bot.catch((error) => {
    console.error("❌ Bot error:", error);
  });

  return bot;
}