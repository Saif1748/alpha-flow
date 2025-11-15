import { useState } from "react";
import { Activity } from "lucide-react";
import { useTrading } from "@/contexts/TradingContext";
import PortfolioOverview from "@/components/PortfolioOverview";
import Watchlist from "@/components/Watchlist";
import PositionsList from "@/components/PositionsList";
import TransactionHistory from "@/components/TransactionHistory";
import TradeModal from "@/components/TradeModal";

const Index = () => {
  const { portfolioValue } = useTrading();
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  const handleTrade = (ticker: string) => {
    setSelectedTicker(ticker);
    setIsTradeModalOpen(true);
  };

  const handleOpenTradeModal = () => {
    setSelectedTicker(null);
    setIsTradeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">PaperTrade</h1>
                <p className="text-xs text-muted-foreground">Virtual Trading Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">Account Value</p>
                <p className="text-lg font-semibold text-foreground">
                  ${portfolioValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Portfolio Overview */}
        <PortfolioOverview onTrade={handleOpenTradeModal} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Positions and Transactions */}
          <div className="lg:col-span-2 space-y-6">
            <PositionsList onTrade={handleTrade} />
            <TransactionHistory />
          </div>

          {/* Right Column - Watchlist */}
          <div className="lg:col-span-1">
            <Watchlist onTrade={handleTrade} />
          </div>
        </div>
      </main>

      {/* Trade Modal */}
      <TradeModal
        open={isTradeModalOpen}
        onOpenChange={setIsTradeModalOpen}
        ticker={selectedTicker}
      />
    </div>
  );
};

export default Index;
