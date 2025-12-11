import { StatCard } from "../StatCard";
import { DollarSign } from "lucide-react";

export default function StatCardExample() {
  return (
    <StatCard
      title="Total Revenue"
      value="$124,560"
      change={12.5}
      changeLabel="vs last month"
      icon={DollarSign}
    />
  );
}
