import { TransactionDocument } from "../../infrastructure/database/models/transaction.model";
import { formatAmount } from "./amount.formatter";
import { formatDate } from "./date.formatter";

export function formatTransactionLine(
  transaction: TransactionDocument,
  index: number
): string {
  const icon = transaction.type === "income" ? "💰" : "💸";
  const label = transaction.type === "income" ? "دخل" : "مصروف";
  const noteText = transaction.note ? `\n   ملاحظة: ${transaction.note}` : "";

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
  transaction: TransactionDocument
): string {
  const label = transaction.type === "income" ? "دخل" : "مصروف";
  const noteText = transaction.note
    ? `\n📝 الملاحظة: ${transaction.note}`
    : "";

  return (
    `✅ تم إضافة ${label} بنجاح\n\n` +
    `💰 المبلغ: ${formatAmount(transaction.amount)}\n` +
    `🏷 التصنيف: ${transaction.category}\n` +
    `📅 التاريخ: ${formatDate(transaction.transactionDate)}` +
    noteText
  );
}