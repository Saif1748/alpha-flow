import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Search, X, Plus } from "lucide-react";
import { useTrading } from "@/contexts/TradingContext";

interface WatchlistProps {
  onTrade: (ticker: string) => void;
}

const Watchlist = ({ onTrade }: WatchlistProps) => {
  const { watchlist, allTickers, addToWatchlist, removeFromWatchlist, getTickerInfo } = useTrading();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddMode, setShowAddMode] = useState(false);

  const filteredTickers = allTickers.filter(
    (ticker) =>
      (ticker.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticker.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      !watchlist.includes(ticker.symbol)
  );

  const watchlistItems = watchlist
    .map((symbol) => getTickerInfo(symbol))
    .filter((item) => item !== undefined);

  return (
    <Card className="p-6 border-border bg-card h-fit sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">Watchlist</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowAddMode(!showAddMode)}
          className="border-border"
        >
          {showAddMode ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>

      {showAddMode && (
        <div className="mb-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search to add..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-secondary border-border"
            />
          </div>
          {searchTerm && (
            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredTickers.slice(0, 10).map((ticker) => (
                <div
                  key={ticker.symbol}
                  className="flex items-center justify-between p-2 rounded bg-secondary/50 hover:bg-secondary cursor-pointer"
                  onClick={() => {
                    addToWatchlist(ticker.symbol);
                    setSearchTerm("");
                  }}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{ticker.symbol}</p>
                    <p className="text-xs text-muted-foreground">{ticker.name}</p>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        {watchlistItems.map((item) => {
          if (!item) return null;
          const isPositive = item.change >= 0;
          return (
            <div
              key={item.symbol}
              className="p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{item.symbol}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${item.price.toFixed(2)}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromWatchlist(item.symbol)}
                    className="h-6 w-6 p-0 hover:bg-destructive/10"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </Button>
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
                  onClick={() => onTrade(item.symbol)}
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
