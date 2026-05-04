import { Types } from "mongoose";
import {
    TransactionType,
    TransactionModel,
    TransactionDocument,
} from "../database/models/transaction.model"

type CreateTransactionData = {
  userId: Types.ObjectId;
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
}

export type TransactionSummary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
};

export class TransactionRepository {
  async create(data: CreateTransactionData): Promise<TransactionDocument> {
    return TransactionModel.create(data);
  }

  async getSummaryByUserId(userId: Types.ObjectId): Promise<TransactionSummary> {
    const result = await TransactionModel.aggregate<{
      totalIncome: number;
      totalExpense: number;
      transactionCount: number;
    }>([
      {
        $match: {
          userId,
        },
      },
      {
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
      },
    ]);

    const summary = result[0];

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