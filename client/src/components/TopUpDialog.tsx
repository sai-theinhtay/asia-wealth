import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (amount: number) => void;
}

const quickAmounts = [50, 100, 200, 500];

export function TopUpDialog({ open, onOpenChange, onSubmit }: TopUpDialogProps) {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onSubmit?.(numAmount);
      setAmount("");
      onOpenChange(false);
    }
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Top Up Wallet</DialogTitle>
          <DialogDescription>
            Add funds to your wallet for quick payments.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                data-testid="input-topup-amount"
              />
            </div>

            <div className="space-y-2">
              <Label>Quick Select</Label>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant="outline"
                    onClick={() => handleQuickAmount(value)}
                    data-testid={`button-quick-${value}`}
                  >
                    ${value}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!amount || parseFloat(amount) <= 0} data-testid="button-confirm-topup">
              Top Up ${amount || "0"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
