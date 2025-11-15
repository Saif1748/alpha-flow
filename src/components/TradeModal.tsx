import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Search } from "lucide-react";
import { useTrading } from "@/contexts/TradingContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticker: string | null;
}

const TradeModal = ({ open, onOpenChange, ticker }: TradeModalProps) => {
  const { executeTrade, getTickerInfo, allTickers, positions, cashBalance } = useTrading();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicker, setSelectedTicker] = useState(ticker || "");
  const [shares, setShares] = useState("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");

  const tickerInfo = selectedTicker ? getTickerInfo(selectedTicker) : null;
  const position = positions.find((p) => p.ticker === selectedTicker);
  const totalValue = shares && tickerInfo ? parseFloat(shares) * tickerInfo.price : 0;

  const filteredTickers = allTickers.filter(
    (t) =>
      t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (ticker) {
      setSelectedTicker(ticker);
      setSearchTerm("");
    }
  }, [ticker]);

  useEffect(() => {
    if (!open) {
      setShares("");
      if (!ticker) {
        setSelectedTicker("");
        setSearchTerm("");
      }
    }
  }, [open, ticker]);

  const handleTrade = () => {
    if (!selectedTicker || !shares || parseFloat(shares) <= 0) return;

    const success = executeTrade(selectedTicker, tradeType, parseFloat(shares));
    if (success) {
      setShares("");
      onOpenChange(false);
    }
  };

  const handleQuickAmount = (percentage: number) => {
    if (tradeType === "buy" && tickerInfo) {
      const availableCash = cashBalance * (percentage / 100);
      const maxShares = Math.floor(availableCash / tickerInfo.price * 100) / 100;
      setShares(maxShares.toString());
    } else if (tradeType === "sell" && position) {
      const sharesToSell = Math.floor(position.shares * (percentage / 100) * 100) / 100;
      setShares(sharesToSell.toString());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Place Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!ticker && (
            <div className="space-y-2">
              <Label htmlFor="search" className="text-foreground">Search Ticker</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Enter ticker symbol or company name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-secondary border-border"
                />
              </div>

              {searchTerm && (
                <ScrollArea className="h-48 rounded-md border border-border">
                  <div className="p-2 space-y-1">
                    {filteredTickers.slice(0, 20).map((t) => (
                      <div
                        key={t.symbol}
                        onClick={() => {
                          setSelectedTicker(t.symbol);
                          setSearchTerm("");
                        }}
                        className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground">{t.symbol}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                {t.type}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{t.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-foreground">${t.price.toFixed(2)}</p>
                            <div className="flex items-center gap-1">
                              {t.change >= 0 ? (
                                <TrendingUp className="h-3 w-3 text-success" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-destructive" />
                              )}
                              <span className={`text-xs ${t.change >= 0 ? "text-success" : "text-destructive"}`}>
                                {t.changePercent.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          )}

          {tickerInfo && (
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-foreground">{tickerInfo.symbol}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {tickerInfo.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{tickerInfo.name}</p>
                  {position && (
                    <p className="text-xs text-muted-foreground mt-1">
                      You own {position.shares} shares @ ${position.avgPrice.toFixed(2)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">${tickerInfo.price.toFixed(2)}</p>
                  <div className="flex items-center gap-1 justify-end">
                    {tickerInfo.change >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                    <span className={`text-sm ${tickerInfo.change >= 0 ? "text-success" : "text-destructive"}`}>
                      {tickerInfo.changePercent >= 0 ? "+" : ""}{tickerInfo.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTicker && (
            <Tabs value={tradeType} onValueChange={(v) => setTradeType(v as "buy" | "sell")}>
              <TabsList className="grid w-full grid-cols-2 bg-secondary">
                <TabsTrigger value="buy" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground">
                  Buy
                </TabsTrigger>
                <TabsTrigger value="sell" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">
                  Sell
                </TabsTrigger>
              </TabsList>

              <TabsContent value="buy" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shares" className="text-foreground">Number of Shares</Label>
                  <Input
                    id="shares"
                    type="number"
                    placeholder="0"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    className="bg-secondary border-border text-foreground"
                    min="0"
                    step="0.01"
                  />
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => handleQuickAmount(25)} className="flex-1 text-xs">25%</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => handleQuickAmount(50)} className="flex-1 text-xs">50%</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => handleQuickAmount(75)} className="flex-1 text-xs">75%</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => handleQuickAmount(100)} className="flex-1 text-xs">Max</Button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-secondary/50 border border-border text-sm">
                  <p className="text-muted-foreground mb-1">Available Cash</p>
                  <p className="font-semibold text-foreground">${cashBalance.toFixed(2)}</p>
                </div>

                {shares && tickerInfo && (
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Shares</span>
                      <span className="text-foreground font-medium">{shares}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Price per Share</span>
                      <span className="text-foreground font-medium">${tickerInfo.price.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-border flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-foreground">${totalValue.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleTrade}
                  className="w-full bg-success hover:bg-success/90 text-success-foreground"
                  disabled={!selectedTicker || !shares || totalValue > cashBalance}
                >
                  {totalValue > cashBalance ? "Insufficient Funds" : "Place Buy Order"}
                </Button>
              </TabsContent>

              <TabsContent value="sell" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shares-sell" className="text-foreground">Number of Shares</Label>
                  <Input
                    id="shares-sell"
                    type="number"
                    placeholder="0"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    className="bg-secondary border-border text-foreground"
                    min="0"
                    step="0.01"
                  />
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => handleQuickAmount(25)} className="flex-1 text-xs" disabled={!position}>25%</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => handleQuickAmount(50)} className="flex-1 text-xs" disabled={!position}>50%</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => handleQuickAmount(75)} className="flex-1 text-xs" disabled={!position}>75%</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => handleQuickAmount(100)} className="flex-1 text-xs" disabled={!position}>All</Button>
                  </div>
                </div>

                {position && (
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border text-sm">
                    <p className="text-muted-foreground mb-1">Shares Owned</p>
                    <p className="font-semibold text-foreground">{position.shares}</p>
                  </div>
                )}

                {!position && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
                    <p className="text-destructive">You don't own any shares of {selectedTicker}</p>
                  </div>
                )}

                {shares && tickerInfo && (
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Shares</span>
                      <span className="text-foreground font-medium">{shares}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Price per Share</span>
                      <span className="text-foreground font-medium">${tickerInfo.price.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-border flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-foreground">${totalValue.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleTrade}
                  className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  disabled={!selectedTicker || !shares || !position || parseFloat(shares) > position.shares}
                >
                  {!position ? "No Shares to Sell" : parseFloat(shares) > position.shares ? "Insufficient Shares" : "Place Sell Order"}
                </Button>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TradeModal;
