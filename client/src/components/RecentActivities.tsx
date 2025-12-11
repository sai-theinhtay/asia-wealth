import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Wrench, Users, DollarSign } from "lucide-react";

interface Activity {
  id: string;
  type: "sale" | "service" | "member" | "payment";
  title: string;
  description: string;
  time: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const iconMap = {
  sale: Car,
  service: Wrench,
  member: Users,
  payment: DollarSign,
};

const badgeVariant = {
  sale: "default" as const,
  service: "secondary" as const,
  member: "outline" as const,
  payment: "default" as const,
};

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card data-testid="recent-activities">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = iconMap[activity.type];
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
              data-testid={`activity-${activity.id}`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{activity.title}</span>
                  <Badge variant={badgeVariant[activity.type]} className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
