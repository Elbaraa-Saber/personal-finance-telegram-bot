import { config } from "../../config/env"

export function formatAmount(amount: number): string {
  return `${amount.toFixed(2)} ${config.defaultCurrency}`;
}