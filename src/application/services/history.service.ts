import { TransactionDocument } from "../../infrastructure/database/models/transaction.model";
import { TransactionRepository } from "../../infrastructure/repositories/transaction.repository";
import { UserRepository } from "../../infrastructure/repositories/user.repository";

export type HistoryPeriod = "day" | "week" | "month" | "year";

type DateRange = {
  startDate: Date;
  endDate: Date;
};

const DEFAULT_HISTORY_LIMIT = 5;
const MAX_HISTORY_LIMIT = 20;

function normalizeLimit(limit: number): number {
  return Math.min(Math.max(limit, 1), MAX_HISTORY_LIMIT);
}

export class HistoryService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly userRepository: UserRepository
  ) {}

  async getRecentTransactions(
    telegramId: number,
    limit = DEFAULT_HISTORY_LIMIT
  ): Promise<TransactionDocument[]> {
    const user = await this.userRepository.findByTelegramId(telegramId);

    if (!user) {
      throw new Error("User not found. Please send /start first.");
    }

    return this.transactionRepository.findRecentByUserId(
      user._id,
      normalizeLimit(limit)
    );
  }

  async getTransactionsForDate(
    telegramId: number,
    date: Date,
    limit = MAX_HISTORY_LIMIT
  ): Promise<TransactionDocument[]> {
    const user = await this.userRepository.findByTelegramId(telegramId);

    if (!user) {
      throw new Error("User not found. Please send /start first.");
    }

    const startDate = date;
    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 1);

    return this.transactionRepository.findByUserIdAndDateRange(
      user._id,
      startDate,
      endDate,
      normalizeLimit(limit)
    );
  }

  async getTransactionsForPeriod(
    telegramId: number,
    period: HistoryPeriod,
    limit = MAX_HISTORY_LIMIT
  ): Promise<TransactionDocument[]> {
    const user = await this.userRepository.findByTelegramId(telegramId);

    if (!user) {
      throw new Error("User not found. Please send /start first.");
    }

    const dateRange = this.getDateRange(period);

    return this.transactionRepository.findByUserIdAndDateRange(
      user._id,
      dateRange.startDate,
      dateRange.endDate,
      normalizeLimit(limit)
    );
  }

  private getDateRange(period: HistoryPeriod): DateRange {
    const now = new Date();

    if (period === "day") {
      const startDate = new Date(
        Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
      );

      const endDate = new Date(startDate);
      endDate.setUTCDate(startDate.getUTCDate() + 1);

      return { startDate, endDate };
    }

    if (period === "week") {
      const currentDate = new Date(
        Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
      );

      const dayOfWeek = currentDate.getUTCDay(); // Sunday = 0
      const daysFromMonday = (dayOfWeek + 6) % 7;

      const startDate = new Date(currentDate);
      startDate.setUTCDate(currentDate.getUTCDate() - daysFromMonday);

      const endDate = new Date(startDate);
      endDate.setUTCDate(startDate.getUTCDate() + 7);

      return { startDate, endDate };
    }

    if (period === "month") {
      const startDate = new Date(
        Date.UTC(now.getFullYear(), now.getMonth(), 1)
      );

      const endDate = new Date(
        Date.UTC(now.getFullYear(), now.getMonth() + 1, 1)
      );

      return { startDate, endDate };
    }

    const startDate = new Date(Date.UTC(now.getFullYear(), 0, 1));
    const endDate = new Date(Date.UTC(now.getFullYear() + 1, 0, 1));

    return { startDate, endDate };
  }
}