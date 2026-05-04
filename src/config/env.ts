import dotenv from "dotenv";

dotenv.config();

const botToken = process.env.BOT_TOKEN;

if (!botToken) {
  throw new Error("❌ BOT_TOKEN is not defined in .env");
}

export const config = {
  botToken,
};


