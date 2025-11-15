import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface Ticker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: "stock" | "crypto";
}

export interface Position {
  ticker: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  type: "stock" | "crypto";
}

export interface Transaction {
  id: string;
  ticker: string;
  type: "buy" | "sell";
  shares: number;
  price: number;
  timestamp: string;
}

interface TradingContextType {
  cashBalance: number;
  positions: Position[];
  transactions: Transaction[];
  watchlist: string[];
  allTickers: Ticker[];
  portfolioValue: number;
  totalPL: number;
  executeTrade: (ticker: string, type: "buy" | "sell", shares: number) => boolean;
  addToWatchlist: (ticker: string) => void;
  removeFromWatchlist: (ticker: string) => void;
  getTickerInfo: (symbol: string) => Ticker | undefined;
  updatePrices: () => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const INITIAL_CASH = 100000;

// Extended ticker list
const INITIAL_TICKERS: Ticker[] = [
  // Tech Stocks
  { symbol: "AAPL", name: "Apple Inc.", price: 165.00, change: 2.50, changePercent: 1.54, type: "stock" },
  { symbol: "MSFT", name: "Microsoft", price: 380.00, change: 5.20, changePercent: 1.39, type: "stock" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 125.00, change: -1.20, changePercent: -0.95, type: "stock" },
  { symbol: "AMZN", name: "Amazon", price: 145.00, change: -2.10, changePercent: -1.43, type: "stock" },
  { symbol: "META", name: "Meta Platforms", price: 335.00, change: 12.30, changePercent: 3.81, type: "stock" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 220.00, change: 8.50, changePercent: 4.02, type: "stock" },
  { symbol: "NVDA", name: "NVIDIA", price: 495.00, change: -8.50, changePercent: -1.69, type: "stock" },
  { symbol: "AMD", name: "AMD Inc.", price: 145.00, change: 3.20, changePercent: 2.26, type: "stock" },
  { symbol: "INTC", name: "Intel Corp.", price: 42.50, change: -0.80, changePercent: -1.85, type: "stock" },
  { symbol: "NFLX", name: "Netflix", price: 425.00, change: 7.50, changePercent: 1.80, type: "stock" },
  
  // Finance
  { symbol: "JPM", name: "JPMorgan Chase", price: 155.00, change: 2.10, changePercent: 1.37, type: "stock" },
  { symbol: "BAC", name: "Bank of America", price: 32.50, change: 0.45, changePercent: 1.40, type: "stock" },
  { symbol: "WFC", name: "Wells Fargo", price: 48.00, change: -0.30, changePercent: -0.62, type: "stock" },
  { symbol: "GS", name: "Goldman Sachs", price: 385.00, change: 5.50, changePercent: 1.45, type: "stock" },
  { symbol: "V", name: "Visa Inc.", price: 245.00, change: 3.20, changePercent: 1.32, type: "stock" },
  
  // Healthcare
  { symbol: "JNJ", name: "Johnson & Johnson", price: 162.00, change: 1.20, changePercent: 0.75, type: "stock" },
  { symbol: "UNH", name: "UnitedHealth", price: 485.00, change: 6.50, changePercent: 1.36, type: "stock" },
  { symbol: "PFE", name: "Pfizer Inc.", price: 28.50, change: -0.40, changePercent: -1.38, type: "stock" },
  { symbol: "MRNA", name: "Moderna", price: 95.00, change: 4.20, changePercent: 4.63, type: "stock" },
  
  // Retail & Consumer
  { symbol: "WMT", name: "Walmart", price: 165.00, change: 1.80, changePercent: 1.10, type: "stock" },
  { symbol: "HD", name: "Home Depot", price: 325.00, change: -2.50, changePercent: -0.76, type: "stock" },
  { symbol: "NKE", name: "Nike Inc.", price: 105.00, change: 2.10, changePercent: 2.04, type: "stock" },
  { symbol: "SBUX", name: "Starbucks", price: 95.00, change: 1.50, changePercent: 1.60, type: "stock" },
  { symbol: "MCD", name: "McDonald's", price: 285.00, change: 3.20, changePercent: 1.13, type: "stock" },
  
  // Energy
  { symbol: "XOM", name: "Exxon Mobil", price: 105.00, change: 2.50, changePercent: 2.44, type: "stock" },
  { symbol: "CVX", name: "Chevron", price: 148.00, change: 1.80, changePercent: 1.23, type: "stock" },
  
  // Entertainment & Media
  { symbol: "DIS", name: "Walt Disney", price: 92.00, change: -1.20, changePercent: -1.29, type: "stock" },
  { symbol: "SPOT", name: "Spotify", price: 185.00, change: 5.50, changePercent: 3.06, type: "stock" },
  
  // Automotive
  { symbol: "F", name: "Ford Motor", price: 12.50, change: 0.30, changePercent: 2.46, type: "stock" },
  { symbol: "GM", name: "General Motors", price: 38.00, change: 0.80, changePercent: 2.15, type: "stock" },
  
  // Aerospace
  { symbol: "BA", name: "Boeing", price: 215.00, change: -3.50, changePercent: -1.60, type: "stock" },
  { symbol: "LMT", name: "Lockheed Martin", price: 445.00, change: 2.50, changePercent: 0.56, type: "stock" },
  
  // Crypto
  { symbol: "BTC", name: "Bitcoin", price: 45000.00, change: 850.00, changePercent: 1.93, type: "crypto" },
  { symbol: "ETH", name: "Ethereum", price: 2200.00, change: 65.00, changePercent: 3.04, type: "crypto" },
  { symbol: "SOL", name: "Solana", price: 125.50, change: 3.20, changePercent: 2.62, type: "crypto" },
  { symbol: "ADA", name: "Cardano", price: 0.55, change: 0.02, changePercent: 3.77, type: "crypto" },
  { symbol: "DOT", name: "Polkadot", price: 7.50, change: -0.30, changePercent: -3.85, type: "crypto" },
  { symbol: "AVAX", name: "Avalanche", price: 38.00, change: 1.20, changePercent: 3.26, type: "crypto" },
  { symbol: "MATIC", name: "Polygon", price: 0.85, change: 0.05, changePercent: 6.25, type: "crypto" },
  { symbol: "LINK", name: "Chainlink", price: 15.50, change: 0.80, changePercent: 5.44, type: "crypto" },
  { symbol: "UNI", name: "Uniswap", price: 8.50, change: -0.20, changePercent: -2.30, type: "crypto" },
  { symbol: "XRP", name: "Ripple", price: 0.62, change: 0.01, changePercent: 1.64, type: "crypto" },
];

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [cashBalance, setCashBalance] = useState(INITIAL_CASH);
  const [positions, setPositions] = useState<Position[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>(["MSFT", "NVDA", "META", "SOL", "AMZN"]);
  const [allTickers, setAllTickers] = useState<Ticker[]>(INITIAL_TICKERS);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCash = localStorage.getItem("cashBalance");
    const savedPositions = localStorage.getItem("positions");
    const savedTransactions = localStorage.getItem("transactions");
    const savedWatchlist = localStorage.getItem("watchlist");

    if (savedCash) setCashBalance(parseFloat(savedCash));
    if (savedPositions) setPositions(JSON.parse(savedPositions));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("cashBalance", cashBalance.toString());
    localStorage.setItem("positions", JSON.stringify(positions));
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [cashBalance, positions, transactions, watchlist]);

  // Simulate price changes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updatePrices();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const updatePrices = () => {
    setAllTickers((prev) =>
      prev.map((ticker) => {
        // Random price change between -2% and +2%
        const changePercent = (Math.random() - 0.5) * 4;
        const priceChange = ticker.price * (changePercent / 100);
        const newPrice = Math.max(ticker.price + priceChange, 0.01);
        
        return {
          ...ticker,
          price: parseFloat(newPrice.toFixed(ticker.type === "crypto" && ticker.price < 10 ? 4 : 2)),
          change: parseFloat(priceChange.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
        };
      })
    );

    // Update positions with new prices
    setPositions((prev) =>
      prev.map((position) => {
        const ticker = allTickers.find((t) => t.symbol === position.ticker);
        if (ticker) {
          return { ...position, currentPrice: ticker.price };
        }
        return position;
      })
    );
  };

  const getTickerInfo = (symbol: string): Ticker | undefined => {
    return allTickers.find((t) => t.symbol === symbol);
  };

  const executeTrade = (ticker: string, type: "buy" | "sell", shares: number): boolean => {
    const tickerInfo = getTickerInfo(ticker);
    if (!tickerInfo) {
      toast({
        title: "Error",
        description: "Ticker not found",
        variant: "destructive",
      });
      return false;
    }

    const totalCost = tickerInfo.price * shares;

    if (type === "buy") {
      if (totalCost > cashBalance) {
        toast({
          title: "Insufficient Funds",
          description: `You need $${totalCost.toFixed(2)} but only have $${cashBalance.toFixed(2)}`,
          variant: "destructive",
        });
        return false;
      }

      // Update or create position
      const existingPosition = positions.find((p) => p.ticker === ticker);
      if (existingPosition) {
        const totalShares = existingPosition.shares + shares;
        const newAvgPrice = 
          (existingPosition.avgPrice * existingPosition.shares + totalCost) / totalShares;
        
        setPositions((prev) =>
          prev.map((p) =>
            p.ticker === ticker
              ? { ...p, shares: totalShares, avgPrice: newAvgPrice, currentPrice: tickerInfo.price }
              : p
          )
        );
      } else {
        setPositions((prev) => [
          ...prev,
          {
            ticker,
            name: tickerInfo.name,
            shares,
            avgPrice: tickerInfo.price,
            currentPrice: tickerInfo.price,
            type: tickerInfo.type,
          },
        ]);
      }

      setCashBalance((prev) => prev - totalCost);
    } else {
      // Sell
      const position = positions.find((p) => p.ticker === ticker);
      if (!position || position.shares < shares) {
        toast({
          title: "Insufficient Shares",
          description: `You only have ${position?.shares || 0} shares of ${ticker}`,
          variant: "destructive",
        });
        return false;
      }

      if (position.shares === shares) {
        // Close position
        setPositions((prev) => prev.filter((p) => p.ticker !== ticker));
      } else {
        // Reduce position
        setPositions((prev) =>
          prev.map((p) =>
            p.ticker === ticker ? { ...p, shares: p.shares - shares } : p
          )
        );
      }

      setCashBalance((prev) => prev + totalCost);
    }

    // Add transaction
    const transaction: Transaction = {
      id: `${Date.now()}-${Math.random()}`,
      ticker,
      type,
      shares,
      price: tickerInfo.price,
      timestamp: new Date().toLocaleString(),
    };
    setTransactions((prev) => [transaction, ...prev].slice(0, 50)); // Keep last 50

    toast({
      title: "Order Executed",
      description: `Successfully ${type === "buy" ? "bought" : "sold"} ${shares} shares of ${ticker} at $${tickerInfo.price.toFixed(2)}`,
    });

    return true;
  };

  const addToWatchlist = (ticker: string) => {
    if (!watchlist.includes(ticker)) {
      setWatchlist((prev) => [...prev, ticker]);
    }
  };

  const removeFromWatchlist = (ticker: string) => {
    setWatchlist((prev) => prev.filter((t) => t !== ticker));
  };

  const portfolioValue = 
    cashBalance +
    positions.reduce((sum, pos) => sum + pos.currentPrice * pos.shares, 0);

  const totalPL = portfolioValue - INITIAL_CASH;

  return (
    <TradingContext.Provider
      value={{
        cashBalance,
        positions,
        transactions,
        watchlist,
        allTickers,
        portfolioValue,
        totalPL,
        executeTrade,
        addToWatchlist,
        removeFromWatchlist,
        getTickerInfo,
        updatePrices,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error("useTrading must be used within TradingProvider");
  }
  return context;
};
