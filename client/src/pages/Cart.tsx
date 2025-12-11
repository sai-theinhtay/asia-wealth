import { useState } from "react";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { PaymentDialog } from "@/components/PaymentDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface CartItem {
  id: string;
  itemType: "service" | "part" | "product";
  itemId: string;
  name: string;
  price: string;
  quantity: number;
  subtotal: string;
}

interface Cart {
  id: string;
  memberId: string;
  status: string;
  items: CartItem[];
  total: number;
}

export default function Cart() {
  const { toast } = useToast();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const queryClient = useQueryClient();
  const memberId = "1"; // TODO: Get from auth context

  const { data: cart, isLoading } = useQuery<Cart>({
    queryKey: ["cart", memberId],
    queryFn: () => api.getCart(memberId),
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      api.updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Cart updated", description: "Item quantity updated" });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => api.removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Item removed", description: "Item removed from cart" });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: (cartId: string) => api.clearCart(cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Cart cleared", description: "All items removed from cart" });
    },
  });

  const handleQuantityChange = (itemId: string, currentQuantity: number, delta: number) => {
    const newQuantity = Math.max(1, currentQuantity + delta);
    updateQuantityMutation.mutate({ itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: string) => {
    removeItemMutation.mutate(itemId);
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) {
      toast({ title: "Cart is empty", description: "Add items to cart before checkout", variant: "destructive" });
      return;
    }
    setPaymentOpen(true);
  };

  const handlePayment = (method: string, data: any) => {
    if (!cart) return;
    // TODO: Process payment and complete cart
    toast({ title: "Payment successful", description: "Your order has been placed!" });
    setPaymentOpen(false);
    // Clear cart after successful payment
    clearCartMutation.mutate(cart.id);
  };

  if (isLoading || !cart) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md">
              <ShoppingCart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">AutoPro - Shopping Cart</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
          <p className="text-muted-foreground text-lg">
            {cart.items.length} {cart.items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {cart.items.length === 0 ? (
          <Card className="shadow-lg border-2">
            <CardContent className="p-16 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-muted">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground text-lg mb-8">Add services or parts to get started</p>
              <Button size="lg" onClick={() => window.location.href = "/member-portal"} className="shadow-md hover:shadow-lg transition-shadow">
                Browse Services
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <Card key={item.id} className="shadow-md hover:shadow-lg transition-shadow border-2" data-testid={`cart-item-${item.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{item.name}</h3>
                          <Badge variant="outline">{item.itemType}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">${item.price} each</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                            disabled={item.quantity <= 1}
                            data-testid={`button-decrease-${item.id}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium" data-testid={`quantity-${item.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                            data-testid={`button-increase-${item.id}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right min-w-[100px]">
                          <p className="font-semibold">${Number(item.subtotal).toFixed(2)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          data-testid={`button-remove-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outline"
                onClick={() => clearCartMutation.mutate(cart.id)}
                disabled={clearCartMutation.status === "pending"}
                data-testid="button-clear-cart"
              >
                Clear Cart
              </Button>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-xl border-2 bg-gradient-to-br from-card to-card/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-base">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">${cart.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-semibold">${(cart.total * 0.1).toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-xl">
                      <span>Total</span>
                      <span className="text-primary">${(cart.total * 1.1).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow"
                    size="lg"
                    onClick={handleCheckout}
                    data-testid="button-checkout"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <PaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        amount={cart.total * 1.1}
        description={`Payment for ${cart.items.length} items`}
        walletBalance={350} // TODO: Get from member data
        onSubmit={handlePayment}
      />
    </div>
  );
}

