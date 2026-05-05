import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { 
    TransactionType,
    TransactionDocument 
} from "../../infrastructure/database/models/transaction.model";
import { TransactionRepository } from "../../infrastructure/repositories/transaction.repository";

type AddTransactionData = {
  telegramId: number;
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  transactionDate?: Date;
};

export class TransactionService {
    constructor(
        private readonly transactionRepository: TransactionRepository,
        private readonly userRepository: UserRepository,
    ){}

    async addTransaction(data: AddTransactionData): Promise<TransactionDocument> {
        if (data.amount <= 0) {
            throw new Error("Amount must be greater than zero");
        }

        const user = await this.userRepository.findByTelegramId(data.telegramId);

        if (!user) {
            throw new Error("user not found. Please send /start first.");
        }

        return this.transactionRepository.create({
                userId: user._id,
                type: data.type,
                amount: data.amount,
                category: data.category,
                ...(data.note ? { note: data.note} : {}),
                ...(data.transactionDate ? { transactionDate: data.transactionDate } : {}),
            });
    }

    async deleteLastTransaction(telegramId: number): Promise<TransactionDocument> {
        const user = await this.userRepository.findByTelegramId(telegramId);

        if (!user) {
            throw new Error("User not found. Please send /start first.");
        }

        const deletedTransaction =
            await this.transactionRepository.deleteLatestByUserId(user._id);

        if (!deletedTransaction) {
            throw new Error("No transactions found to delete.");
        }

        return deletedTransaction;
    }
}