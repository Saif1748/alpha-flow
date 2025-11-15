import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

const mockChartData = [
  { time: "9:30", value: 100000 },
  { time: "10:00", value: 100500 },
  { time: "10:30", value: 100200 },
  { time: "11:00", value: 101000 },
  { time: "11:30", value: 100800 },
  { time: "12:00", value: 101500 },
  { time: "12:30", value: 102000 },
  { time: "13:00", value: 101800 },
  { time: "13:30", value: 102500 },
  { time: "14:00", value: 103000 },
];

const PortfolioOverview = () => {
  const portfolioValue = 103000;
  const dayChange = 3000;
  const dayChangePercent = 3.0;
  const isPositive = dayChange >= 0;

  return (
    <Card className="p-6 border-border bg-card">
      <div className="space-y-6">
        {/* Header */}
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
                ${Math.abs(dayChange).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({Math.abs(dayChangePercent).toFixed(2)}%)
              </span>
              <span className="text-muted-foreground text-sm">Today</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChartData}>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Cash Balance</p>
            <p className="text-lg font-semibold text-foreground">$95,000.00</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Invested</p>
            <p className="text-lg font-semibold text-foreground">$8,000.00</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total P&L</p>
            <p className="text-lg font-semibold text-success">+$3,000.00</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Open Positions</p>
            <p className="text-lg font-semibold text-foreground">5</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PortfolioOverview;
