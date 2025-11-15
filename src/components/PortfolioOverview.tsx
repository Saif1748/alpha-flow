import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { useTrading } from "@/contexts/TradingContext";
import { useEffect, useState } from "react";

const generateChartData = (currentValue: number) => {
  const data = [];
  const startValue = currentValue * 0.97;
  for (let i = 0; i < 10; i++) {
    const variance = (Math.random() - 0.5) * currentValue * 0.02;
    const value = startValue + (currentValue - startValue) * (i / 9) + variance;
    data.push({
      time: `${9 + Math.floor(i * 0.6)}:${(i * 6) % 60}`,
      value: parseFloat(value.toFixed(2)),
    });
  }
  return data;
};

interface PortfolioOverviewProps {
  onTrade: () => void;
}

const PortfolioOverview = ({ onTrade }: PortfolioOverviewProps) => {
  const { portfolioValue, totalPL, cashBalance, positions } = useTrading();
  const [chartData, setChartData] = useState(generateChartData(portfolioValue));

  const dayChangePercent = (totalPL / 100000) * 100;
  const isPositive = totalPL >= 0;
  const invested = positions.reduce((sum, pos) => sum + pos.currentPrice * pos.shares, 0);

  useEffect(() => {
    setChartData(generateChartData(portfolioValue));
  }, [portfolioValue]);

  return (
    <Card className="p-6 border-border bg-card">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Portfolio Value</p>
            <h2 className="text-4xl font-bold text-foreground">
              ${portfolioValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className={isPositive ? "text-success" : "text-destructive"}>
                {isPositive ? "+" : ""}${Math.abs(totalPL).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({isPositive ? "+" : ""}{dayChangePercent.toFixed(2)}%)
              </span>
              <span className="text-muted-foreground text-sm">Total P&L</span>
            </div>
          </div>
          <Button onClick={onTrade} className="bg-primary hover:bg-primary/90">
            New Trade
          </Button>
        </div>

        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#portfolioGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Cash Balance</p>
            <p className="text-lg font-semibold text-foreground">
              ${cashBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Invested</p>
            <p className="text-lg font-semibold text-foreground">
              ${invested.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total P&L</p>
            <p className={`text-lg font-semibold ${isPositive ? "text-success" : "text-destructive"}`}>
              {isPositive ? "+" : ""}${Math.abs(totalPL).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Open Positions</p>
            <p className="text-lg font-semibold text-foreground">{positions.length}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PortfolioOverview;
