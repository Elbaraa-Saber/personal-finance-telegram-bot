import { registerStartCommand } from "./bot/commands/start.command";
import { createBot } from "./bot/bot";
import { UserService } from "./application/services/user.service";
import { UserRepository } from "./infrastructure/repositories/user.repository";
import { connectToDatabase } from "./infrastructure/database/mongoose";
import { TransactionRepository } from "./infrastructure/repositories/transaction.repository";
import { TransactionService } from "./application/services/transaction.service";
import { registerTransactionCommands } from "./bot/commands/transaction.command";
import { registerReportCommand } from "./bot/commands/report.command";
import { ReportService } from "./application/services/report.service";

async function main(): Promise<void> {
  await connectToDatabase();

  const bot = createBot();

  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);

  const transactionRepository = new TransactionRepository();
  const transactionService = new TransactionService(
    transactionRepository,
    userRepository
  );

  const reportService = new ReportService(
    transactionRepository,
    userRepository
  );


  registerStartCommand(bot, userService);
  registerTransactionCommands(bot, transactionService);
  registerReportCommand(bot, reportService);
  
  bot.start({
    onStart: () => {
      console.log("🤖 Bot is running...");
    },
  });
}

main().catch((error) => {
  console.error("❌ Application failed to start:", error);
  process.exit(1);
});