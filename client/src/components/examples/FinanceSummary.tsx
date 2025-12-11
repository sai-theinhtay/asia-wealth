import { FinanceSummary } from "../FinanceSummary";

export default function FinanceSummaryExample() {
  return (
    <FinanceSummary
      totalRevenue={124560}
      totalExpenses={45200}
      netProfit={79360}
      outstanding={12500}
      targetRevenue={150000}
    />
  );
}
