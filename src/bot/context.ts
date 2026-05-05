import { Context, SessionFlavor } from "grammy";
import { TransactionType } from "../infrastructure/database/models/transaction.model";

export type PendingTransaction = {
  type: TransactionType;
};

export type SessionData = {
  pendingTransaction: PendingTransaction | null;
  pendingCurrencyInput: boolean;
};

export type BotContext = Context & SessionFlavor<SessionData>;

export function createInitialSession(): SessionData {
  return {
    pendingTransaction: null,
    pendingCurrencyInput: false,
  };
}