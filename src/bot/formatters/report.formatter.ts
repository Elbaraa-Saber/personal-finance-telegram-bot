import { ReportResult } from "../../application/services/report.service";
import { SupportedLanguage } from "../i18n/language";
import { getMessages } from "../i18n/translations";
import { formatAmount } from "./amount.formatter";

export function formatReport(
  report: ReportResult,
  language: SupportedLanguage,
  currency: string
): string {
  const messages = getMessages(language);
  const title = messages.report.titles[report.period];

  return (
    `${title}\n\n` +
    `${messages.report.totalIncome}: ${formatAmount(report.totalIncome, currency)}\n` +
    `${messages.report.totalExpense}: ${formatAmount(report.totalExpense, currency)}\n` +
    `${messages.report.balance}: ${formatAmount(report.balance, currency)}\n` +
    `${messages.report.transactionCount}: ${report.transactionCount}`
  );
}