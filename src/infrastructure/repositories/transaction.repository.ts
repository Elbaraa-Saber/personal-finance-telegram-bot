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

export class TransactionRepository {
  async create(data: CreateTransactionData): Promise<TransactionDocument> {
    return TransactionModel.create(data);
  }
}