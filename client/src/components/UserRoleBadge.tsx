import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck, User } from "lucide-react";

export type UserRole = "admin" | "subadmin" | "staff" | "member";

interface UserRoleBadgeProps {
  role: UserRole;
}

const roleConfig = {
  admin: {
    label: "Admin",
    icon: ShieldCheck,
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  subadmin: {
    label: "Sub-Admin",
    icon: Shield,
    className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  staff: {
    label: "Staff",
    icon: User,
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  member: {
    label: "Member",
    icon: User,
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  },
};

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} border-0 gap-1`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
