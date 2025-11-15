import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useTrading } from "@/contexts/TradingContext";

const TransactionHistory = () => {
  const { transactions } = useTrading();

  if (transactions.length === 0) {
    return (
      <Card className="p-6 border-border bg-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">Recent Transactions</h3>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No transactions yet. Your trade history will appear here.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-border bg-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">Recent Transactions</h3>
      </div>

      <div className="space-y-3">
        {transactions.slice(0, 10).map((transaction) => (
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
