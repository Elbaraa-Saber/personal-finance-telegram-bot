import { ReportResult } from "../../application/services/report.service";
import { SupportedLanguage } from "../i18n/language";
import { getMessages } from "../i18n/translations";
import { formatAmount } from "./amount.formatter";

export function formatReport(
  report: ReportResult,
  language: SupportedLanguage
): string {
  const messages = getMessages(language);
  const title = messages.report.titles[report.period];

  return (
    `${title}\n\n` +
    `${messages.report.totalIncome}: ${formatAmount(report.totalIncome)}\n` +
    `${messages.report.totalExpense}: ${formatAmount(report.totalExpense)}\n` +
    `${messages.report.balance}: ${formatAmount(report.balance)}\n` +
    `${messages.report.transactionCount}: ${report.transactionCount}`
  );
}