import { ReportResult } from "../../application/services/report.service";
import { formatAmount } from "./amount.formatter";

export function formatReport(report: ReportResult): string {
  return (
    `${report.title}\n\n` +
    `إجمالي الدخل: ${formatAmount(report.totalIncome)}\n` +
    `إجمالي المصروف: ${formatAmount(report.totalExpense)}\n` +
    `الرصيد: ${formatAmount(report.balance)}\n` +
    `عدد العمليات: ${report.transactionCount}`
  );
}