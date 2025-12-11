import { TransactionTable } from "../TransactionTable";

// todo: remove mock functionality
const mockTransactions = [
  { id: "1", type: "sale" as const, description: "2024 Toyota Camry - John Smith", date: "Dec 8, 2025", amount: 28500, status: "paid" as const },
  { id: "2", type: "service" as const, description: "Brake service - Honda Accord", date: "Dec 7, 2025", amount: 450, status: "paid" as const },
  { id: "3", type: "expense" as const, description: "Parts inventory - Oil filters", date: "Dec 6, 2025", amount: 1200, status: "paid" as const },
  { id: "4", type: "service" as const, description: "Engine repair - Ford F-150", date: "Dec 5, 2025", amount: 2500, status: "pending" as const },
];

export default function TransactionTableExample() {
  return <TransactionTable transactions={mockTransactions} />;
}
