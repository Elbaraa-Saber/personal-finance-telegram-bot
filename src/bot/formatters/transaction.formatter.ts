import { TransactionDocument } from "../../infrastructure/database/models/transaction.model";
import { formatAmount } from "./amount.formatter";
import { formatDate } from "./date.formatter";
import { SupportedLanguage } from "../i18n/language";
import { getMessages } from "../i18n/translations";

export function formatTransactionLine(
  transaction: TransactionDocument,
  index: number,
  language: SupportedLanguage
): string {
  const messages = getMessages(language);
  const icon = transaction.type === "income" ? "💰" : "💸";
  const label =
    transaction.type === "income"
      ? messages.transaction.income
      : messages.transaction.expense;

  const noteText = transaction.note
    ? `\n   ${messages.transaction.note}: ${transaction.note}`
    : "";

  return (
    `${index + 1}. ${icon} ${label} | ` +
    `${formatAmount(transaction.amount)} | ` +
    `${transaction.category} | ` +
    `${formatDate(transaction.transactionDate)}` +
    noteText
  );
}

export function formatDeletedTransaction(
  transaction: TransactionDocument
): string {
  const label = transaction.type === "income" ? "دخل" : "مصروف";
  const icon = transaction.type === "income" ? "💰" : "💸";
  const noteText = transaction.note ? `\nملاحظة: ${transaction.note}` : "";

  return (
    `${icon} تم حذف آخر ${label}\n\n` +
    `المبلغ: ${formatAmount(transaction.amount)}\n` +
    `التصنيف: ${transaction.category}\n` +
    `التاريخ: ${formatDate(transaction.transactionDate)}` +
    noteText
  );
}

export function formatCreatedTransaction(
  transaction: TransactionDocument,
  language: SupportedLanguage
): string {
  const messages = getMessages(language);

  const label =
    transaction.type === "income"
      ? messages.transaction.income
      : messages.transaction.expense;

  const noteText = transaction.note
    ? `\n📝 ${messages.transaction.note}: ${transaction.note}`
    : "";

  return (
    `✅ ${label} added successfully\n\n` +
    `💰 ${formatAmount(transaction.amount)}\n` +
    `🏷 ${transaction.category}\n` +
    `📅 ${formatDate(transaction.transactionDate)}` +
    noteText
  );
}