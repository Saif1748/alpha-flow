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
import { useToast } from "@/hooks/use-toast";

interface TradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticker: string | null;
}

const TradeModal = ({ open, onOpenChange, ticker }: TradeModalProps) => {
  const [searchTicker, setSearchTicker] = useState("");
  const [selectedTicker, setSelectedTicker] = useState(ticker || "");
  const [shares, setShares] = useState("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const { toast } = useToast();

  // Mock price for demo
  const currentPrice = 165.00;
  const totalValue = shares ? parseFloat(shares) * currentPrice : 0;

  useEffect(() => {
    if (ticker) {
      setSelectedTicker(ticker);
      setSearchTicker("");
    }
  }, [ticker]);

  const handleTrade = () => {
    if (!selectedTicker || !shares || parseFloat(shares) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid ticker and number of shares",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Order Executed",
      description: `Successfully ${tradeType === "buy" ? "bought" : "sold"} ${shares} shares of ${selectedTicker} at $${currentPrice}`,
    });

    // Reset form
    setShares("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Place Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Ticker Search */}
          {!ticker && (
            <div className="space-y-2">
              <Label htmlFor="search" className="text-foreground">Search Ticker</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Enter ticker symbol..."
                  value={searchTicker}
                  onChange={(e) => {
                    setSearchTicker(e.target.value);
                    setSelectedTicker(e.target.value.toUpperCase());
                  }}
                  className="pl-9 bg-secondary border-border"
                />
              </div>
            </div>
          )}

          {/* Selected Ticker Info */}
          {selectedTicker && (
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedTicker}</h3>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">${currentPrice.toFixed(2)}</p>
                  <div className="flex items-center gap-1 justify-end">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-sm text-success">+2.5%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trade Type Tabs */}
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
              </div>

              {shares && (
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Shares</span>
                    <span className="text-foreground font-medium">{shares}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Price per Share</span>
                    <span className="text-foreground font-medium">${currentPrice.toFixed(2)}</span>
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
                disabled={!selectedTicker || !shares}
              >
                Place Buy Order
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
              </div>

              {shares && (
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Shares</span>
                    <span className="text-foreground font-medium">{shares}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Price per Share</span>
                    <span className="text-foreground font-medium">${currentPrice.toFixed(2)}</span>
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
                disabled={!selectedTicker || !shares}
              >
                Place Sell Order
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TradeModal;
