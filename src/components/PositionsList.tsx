import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTrading } from "@/contexts/TradingContext";

interface PositionsListProps {
  onTrade: (ticker: string) => void;
}

const PositionsList = ({ onTrade }: PositionsListProps) => {
  const { positions } = useTrading();

  if (positions.length === 0) {
    return (
      <Card className="p-6 border-border bg-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">Open Positions</h3>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No open positions yet. Start trading to see your positions here.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-border bg-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">Open Positions</h3>
      </div>

      <div className="space-y-3">
        {positions.map((position) => {
          const pl = (position.currentPrice - position.avgPrice) * position.shares;
          const plPercent = ((position.currentPrice - position.avgPrice) / position.avgPrice) * 100;
          const isPositive = pl >= 0;

          return (
            <div
              key={position.ticker}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{position.ticker}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {position.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{position.name}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Shares</p>
                  <p className="font-medium text-foreground">{position.shares}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Avg Price</p>
                  <p className="font-medium text-foreground">
                    ${position.avgPrice.toFixed(2)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Current</p>
                  <p className="font-medium text-foreground">
                    ${position.currentPrice.toFixed(2)}
                  </p>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="text-sm text-muted-foreground">P&L</p>
                  <div className="flex items-center gap-1 justify-end">
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                    <span className={isPositive ? "text-success font-medium" : "text-destructive font-medium"}>
                      {isPositive ? "+" : ""}${Math.abs(pl).toFixed(2)}
                    </span>
                  </div>
                  <p className={`text-xs ${isPositive ? "text-success" : "text-destructive"}`}>
                    {isPositive ? "+" : ""}{plPercent.toFixed(2)}%
                  </p>
                </div>

                <Button
                  onClick={() => onTrade(position.ticker)}
                  variant="outline"
                  size="sm"
                  className="border-border hover:bg-secondary"
                >
                  Trade
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PositionsList;
