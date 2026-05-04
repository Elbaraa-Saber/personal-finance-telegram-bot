import {
  TransactionRepository,
  TransactionSummary,
} from "../../infrastructure/repositories/transaction.repository";
import { UserRepository } from "../../infrastructure/repositories/user.repository";

export class ReportService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly userRepository: UserRepository
  ) {}

  async getUserSummary(telegramId: number): Promise<TransactionSummary> {
    const user = await this.userRepository.findByTelegramId(telegramId);

    if (!user) {
      throw new Error("User not found. Please send /start first.");
    }

    return this.transactionRepository.getSummaryByUserId(user._id);
  }
}