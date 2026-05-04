import { TransactionDocument } from "../../infrastructure/database/models/transaction.model";
import { TransactionRepository } from "../../infrastructure/repositories/transaction.repository";
import { UserRepository } from "../../infrastructure/repositories/user.repository";

export class HistoryService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly userRepository: UserRepository
  ) {}

  async getRecentTransactions(
    telegramId: number,
    limit = 5
  ): Promise<TransactionDocument[]> {
    const user = await this.userRepository.findByTelegramId(telegramId);

    if (!user) {
      throw new Error("User not found. Please send /start first.");
    }

    return this.transactionRepository.findRecentByUserId(user._id, limit);
  }
}