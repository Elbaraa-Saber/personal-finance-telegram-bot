import { Types } from "mongoose";
import {
  TransactionDocument,
  TransactionModel,
  TransactionType,
} from "../database/models/transaction.model";

type CreateTransactionData = {
  userId: Types.ObjectId;
  type: TransactionType;
  amount: number;
  category: string;
  transactionDate: Date;
  note?: string;
};

export type TransactionSummary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
};

type AggregatedTransactionSummary = {
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
};

export class TransactionRepository {
  async create(data: CreateTransactionData): Promise<TransactionDocument> {
    return TransactionModel.create(data);
  }

  async findRecentByUserId(
        userId: Types.ObjectId,
        limit: number
    ): Promise<TransactionDocument[]> {
        return TransactionModel.find({ userId })
            .sort({ transactionDate: -1, createdAt: -1 })
            .limit(limit)
            .exec();
    }

  async deleteLatestByUserId(
    userId: Types.ObjectId
  ): Promise<TransactionDocument | null> {
    return TransactionModel.findOneAndDelete(
      { userId },
      { sort: { createdAt: -1 } }
    ).exec();
  }

  async getSummaryByUserId(userId: Types.ObjectId): Promise<TransactionSummary> {
    const result = await TransactionModel.aggregate<AggregatedTransactionSummary>(
      [
        {
          $match: {
            userId,
          },
        },
        this.createSummaryGroupStage(),
      ]
    );

    return this.toTransactionSummary(result[0]);
  }

    async getSummaryByUserIdAndDateRange(
        userId: Types.ObjectId,
        startDate: Date,
        endDate: Date
    ): Promise<TransactionSummary> {
        const result = await TransactionModel.aggregate<AggregatedTransactionSummary>(
            [
            {
                $match: {
                userId,
                transactionDate: {
                    $gte: startDate,
                    $lt: endDate,
                },
                },
            },
            this.createSummaryGroupStage(),
            ]
        );

        return this.toTransactionSummary(result[0]);
    }

  private createSummaryGroupStage() {
    return {
      $group: {
        _id: null,
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        totalExpense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
        transactionCount: {
          $sum: 1,
        },
      },
    };
  }

  private toTransactionSummary(
    summary: AggregatedTransactionSummary | undefined
  ): TransactionSummary {
    if (!summary) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        transactionCount: 0,
      };
    }

    return {
      totalIncome: summary.totalIncome,
      totalExpense: summary.totalExpense,
      balance: summary.totalIncome - summary.totalExpense,
      transactionCount: summary.transactionCount,
    };
  }
}