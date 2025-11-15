import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Plus, Search } from "lucide-react";

interface WatchlistItem {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: "stock" | "crypto";
}

const mockWatchlist: WatchlistItem[] = [
  { ticker: "MSFT", name: "Microsoft", price: 380.00, change: 5.20, changePercent: 1.39, type: "stock" },
  { ticker: "NVDA", name: "NVIDIA", price: 495.00, change: -8.50, changePercent: -1.69, type: "stock" },
  { ticker: "META", name: "Meta", price: 335.00, change: 12.30, changePercent: 3.81, type: "stock" },
  { ticker: "SOL", name: "Solana", price: 125.50, change: 3.20, changePercent: 2.62, type: "crypto" },
  { ticker: "AMZN", name: "Amazon", price: 145.00, change: -2.10, changePercent: -1.43, type: "stock" },
];

interface WatchlistProps {
  onTrade: (ticker: string) => void;
}

const Watchlist = ({ onTrade }: WatchlistProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Card className="p-6 border-border bg-card h-fit sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">Watchlist</h3>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search ticker..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-secondary border-border"
        />
      </div>

      <div className="space-y-2">
        {mockWatchlist.map((item) => {
          const isPositive = item.change >= 0;
          return (
            <div
              key={item.ticker}
              className="p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors cursor-pointer"
              onClick={() => onTrade(item.ticker)}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{item.ticker}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  )}
                  <span className={`text-xs font-medium ${isPositive ? "text-success" : "text-destructive"}`}>
                    {isPositive ? "+" : ""}${Math.abs(item.change).toFixed(2)} ({isPositive ? "+" : ""}{item.changePercent.toFixed(2)}%)
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-3 text-xs border-border hover:bg-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTrade(item.ticker);
                  }}
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

export default Watchlist;
