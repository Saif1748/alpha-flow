import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Transaction {
  id: string;
  ticker: string;
  type: "buy" | "sell";
  shares: number;
  price: number;
  timestamp: string;
}

const mockTransactions: Transaction[] = [
  { id: "1", ticker: "AAPL", type: "buy", shares: 10, price: 150.00, timestamp: "2024-01-15 09:30" },
  { id: "2", ticker: "TSLA", type: "buy", shares: 5, price: 200.00, timestamp: "2024-01-15 10:15" },
  { id: "3", ticker: "BTC", type: "buy", shares: 0.1, price: 40000.00, timestamp: "2024-01-15 11:00" },
  { id: "4", ticker: "GOOGL", type: "buy", shares: 8, price: 130.00, timestamp: "2024-01-15 13:20" },
  { id: "5", ticker: "ETH", type: "buy", shares: 2, price: 2000.00, timestamp: "2024-01-15 14:45" },
];

const TransactionHistory = () => {
  return (
    <Card className="p-6 border-border bg-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">Recent Transactions</h3>
      </div>

      <div className="space-y-3">
        {mockTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${
                transaction.type === "buy" 
                  ? "bg-success/10 text-success" 
                  : "bg-destructive/10 text-destructive"
              }`}>
                {transaction.type === "buy" ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{transaction.ticker}</h4>
                  <Badge variant={transaction.type === "buy" ? "default" : "destructive"} className="text-xs">
                    {transaction.type.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{transaction.timestamp}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Shares</p>
                <p className="font-medium text-foreground">{transaction.shares}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-medium text-foreground">${transaction.price.toFixed(2)}</p>
              </div>
              <div className="text-right min-w-[100px]">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-semibold text-foreground">
                  ${(transaction.shares * transaction.price).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TransactionHistory;
