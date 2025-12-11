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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet, Banknote } from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  description: string;
  walletBalance?: number;
  onSubmit?: (method: string, data: PaymentData) => void;
}

interface PaymentData {
  method: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export function PaymentDialog({ 
  open, 
  onOpenChange, 
  amount, 
  description,
  walletBalance = 0,
  onSubmit 
}: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(paymentMethod, { method: paymentMethod, cardNumber, expiryDate, cvv });
    onOpenChange(false);
  };

  const canUseWallet = walletBalance >= amount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-md bg-muted">
              <p className="text-sm text-muted-foreground">Amount Due</p>
              <p className="text-2xl font-bold">${amount.toLocaleString()}</p>
            </div>

            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                <label
                  className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer ${
                    paymentMethod === "wallet" ? "border-primary bg-primary/5" : ""
                  } ${!canUseWallet ? "opacity-50" : ""}`}
                >
                  <RadioGroupItem value="wallet" disabled={!canUseWallet} />
                  <Wallet className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="font-medium">Wallet</p>
                    <p className="text-sm text-muted-foreground">
                      Balance: ${walletBalance.toLocaleString()}
                      {!canUseWallet && " (Insufficient)"}
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer ${
                    paymentMethod === "card" ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <RadioGroupItem value="card" />
                  <CreditCard className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-sm text-muted-foreground">Visa, Mastercard, AMEX</p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer ${
                    paymentMethod === "cash" ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <RadioGroupItem value="cash" />
                  <Banknote className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="font-medium">Cash</p>
                    <p className="text-sm text-muted-foreground">Pay at the counter</p>
                  </div>
                </label>
              </div>
            </RadioGroup>

            {paymentMethod === "card" && (
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    data-testid="input-card-number"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                      data-testid="input-expiry"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      data-testid="input-cvv"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" data-testid="button-pay-now">
              Pay ${amount.toLocaleString()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
