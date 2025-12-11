import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, TrendingUp, Gift } from "lucide-react";

interface PointsDisplayProps {
  currentPoints: number;
  lifetimePoints: number;
  nextLevelPoints: number;
  nextLevel: string;
}

export function PointsDisplay({ currentPoints, lifetimePoints, nextLevelPoints, nextLevel }: PointsDisplayProps) {
  const progress = Math.min((currentPoints / nextLevelPoints) * 100, 100);

  return (
    <Card data-testid="points-display">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          Reward Points
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold">{currentPoints.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Available Points</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-muted-foreground">{lifetimePoints.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Lifetime Earned</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Progress to {nextLevel}
            </span>
            <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {(nextLevelPoints - currentPoints).toLocaleString()} points to next level
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-md bg-muted">
          <Gift className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Redeem points for discounts on services</span>
        </div>
      </CardContent>
    </Card>
  );
}
