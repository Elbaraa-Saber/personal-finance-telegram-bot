import { Context, SessionFlavor } from "grammy";
import { TransactionType } from "../infrastructure/database/models/transaction.model";

export type AddTransactionStep = "amount" | "category" | "date" | "note";

export type PendingTransaction = {
  type: TransactionType;
  step: AddTransactionStep;
  amount?: number;
  category?: string;
  transactionDateText?: string;
};

export type BotContext = Context & SessionFlavor<SessionData>;

export type SessionData = {
  pendingTransaction: PendingTransaction | null;
  pendingCurrencyInput: boolean;
};

export function createInitialSession(): SessionData {
  return {
    pendingTransaction: null,
    pendingCurrencyInput: false,
  };
}