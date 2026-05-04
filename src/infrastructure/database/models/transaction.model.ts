import { model, Schema, Types } from "mongoose";

export type TransactionType = "income" | "expense";

export interface TransactionDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<TransactionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TransactionModel = model<TransactionDocument>(
  "Transaction",
  transactionSchema
);