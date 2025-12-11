import { Badge } from "@/components/ui/badge";
import { Crown, Award, Star, Medal } from "lucide-react";

export type MemberLevel = "bronze" | "silver" | "gold" | "platinum";

interface MemberLevelBadgeProps {
  level: MemberLevel;
  showIcon?: boolean;
}

const levelConfig = {
  bronze: {
    label: "Bronze",
    icon: Medal,
    className: "bg-amber-700/20 text-amber-700 dark:bg-amber-700/30 dark:text-amber-400",
  },
  silver: {
    label: "Silver",
    icon: Star,
    className: "bg-slate-400/20 text-slate-600 dark:bg-slate-400/30 dark:text-slate-300",
  },
  gold: {
    label: "Gold",
    icon: Award,
    className: "bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/30 dark:text-yellow-400",
  },
  platinum: {
    label: "Platinum",
    icon: Crown,
    className: "bg-purple-500/20 text-purple-700 dark:bg-purple-500/30 dark:text-purple-400",
  },
};

export function MemberLevelBadge({ level, showIcon = true }: MemberLevelBadgeProps) {
  const config = levelConfig[level];
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} border-0 gap-1`}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}
