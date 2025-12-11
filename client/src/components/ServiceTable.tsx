import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";

interface ServiceAppointment {
  id: string;
  vehicle: string;
  customer: string;
  service: string;
  date: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  amount: number;
}

interface ServiceTableProps {
  appointments: ServiceAppointment[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export function ServiceTable({ appointments, onView, onEdit }: ServiceTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((apt) => (
            <TableRow key={apt.id} data-testid={`service-row-${apt.id}`}>
              <TableCell className="font-medium">{apt.vehicle}</TableCell>
              <TableCell>{apt.customer}</TableCell>
              <TableCell>{apt.service}</TableCell>
              <TableCell>{apt.date}</TableCell>
              <TableCell>
                <Badge className={`${statusStyles[apt.status]} border-0`}>
                  {apt.status.replace("-", " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">${apt.amount.toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView?.(apt.id)}
                    data-testid={`button-view-service-${apt.id}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit?.(apt.id)}
                    data-testid={`button-edit-service-${apt.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
