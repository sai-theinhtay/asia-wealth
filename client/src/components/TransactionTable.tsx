import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  type: "sale" | "service" | "expense";
  description: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
}

interface TransactionTableProps {
  transactions: Transaction[];
}

const typeStyles = {
  sale: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  service: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  expense: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusStyles = {
  paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id} data-testid={`transaction-row-${tx.id}`}>
              <TableCell>
                <Badge className={`${typeStyles[tx.type]} border-0`}>
                  {tx.type}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">{tx.description}</TableCell>
              <TableCell>{tx.date}</TableCell>
              <TableCell>
                <Badge className={`${statusStyles[tx.status]} border-0`}>
                  {tx.status}
                </Badge>
              </TableCell>
              <TableCell className={`text-right font-medium ${
                tx.type === "expense" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
              }`}>
                {tx.type === "expense" ? "-" : "+"}${tx.amount.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
