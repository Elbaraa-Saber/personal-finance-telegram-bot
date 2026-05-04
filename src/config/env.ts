import dotenv from "dotenv";

dotenv.config();

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`❌ ${name} is not defined in .env`);
  }

  return value;
}

export const config = {
  botToken: getRequiredEnv("BOT_TOKEN"),
  mongoUri: getRequiredEnv("MONGO_URI"),

  useProxy: process.env.USE_PROXY === "true",
  socksProxyUrl: process.env.SOCKS_PROXY_URL,
};

if (config.useProxy && !config.socksProxyUrl) {
  throw new Error("❌ SOCKS_PROXY_URL is required when USE_PROXY=true");
}