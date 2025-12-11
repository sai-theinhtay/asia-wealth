import { useState } from "react";
import { Car, Wrench, History, LogOut, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberLevelBadge } from "@/components/MemberLevelBadge";
import { PointsDisplay } from "@/components/PointsDisplay";
import { WalletCard, WalletTransactions } from "@/components/WalletCard";
import { TopUpDialog } from "@/components/TopUpDialog";
import { PaymentDialog } from "@/components/PaymentDialog";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockMember = {
  name: "John Smith",
  email: "john.smith@email.com",
  phone: "(555) 123-4567",
  level: "gold" as const,
  points: 2450,
  lifetimePoints: 5200,
  walletBalance: 350,
  joinDate: "Jan 2024",
};

// todo: remove mock functionality
const mockVehicles = [
  { id: "1", make: "Toyota", model: "Camry", year: 2023, plate: "ABC-1234" },
  { id: "2", make: "Honda", model: "CR-V", year: 2022, plate: "XYZ-5678" },
];

// todo: remove mock functionality
const mockServiceHistory = [
  { id: "1", service: "Oil Change", vehicle: "2023 Toyota Camry", date: "Dec 5, 2025", amount: 85, status: "completed" },
  { id: "2", service: "Brake Service", vehicle: "2022 Honda CR-V", date: "Nov 20, 2025", amount: 450, status: "completed" },
  { id: "3", service: "Tire Rotation", vehicle: "2023 Toyota Camry", date: "Oct 15, 2025", amount: 65, status: "completed" },
];

// todo: remove mock functionality
const mockWalletTransactions = [
  { id: "1", type: "credit" as const, amount: 200, description: "Wallet Top-up", date: "Dec 1, 2025" },
  { id: "2", type: "debit" as const, amount: 85, description: "Oil Change Payment", date: "Dec 5, 2025" },
  { id: "3", type: "credit" as const, amount: 50, description: "Points Redemption", date: "Nov 25, 2025" },
];

export default function MemberPortal() {
  const { toast } = useToast();
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">AutoPro</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cart" data-testid="button-cart">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
              </Link>
            </Button>
            <Button variant="ghost" size="sm" data-testid="button-logout">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-8">
        <Card className="shadow-lg border-2 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-8">
            <div className="flex items-center gap-6 flex-wrap">
              <Avatar className="h-20 w-20 ring-4 ring-primary/20">
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  {mockMember.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="text-2xl font-bold tracking-tight">{mockMember.name}</h1>
                  <MemberLevelBadge level={mockMember.level} />
                </div>
                <p className="text-muted-foreground text-base">{mockMember.email}</p>
                <p className="text-sm text-muted-foreground mt-1">Member since {mockMember.joinDate}</p>
              </div>
              <Button variant="outline" size="lg" data-testid="button-edit-profile" className="shadow-sm hover:shadow-md transition-shadow">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <PointsDisplay
            currentPoints={mockMember.points}
            lifetimePoints={mockMember.lifetimePoints}
            nextLevelPoints={5000}
            nextLevel="Platinum"
          />
          <WalletCard
            balance={mockMember.walletBalance}
            onTopUp={() => setTopUpOpen(true)}
            onViewHistory={() => toast({ title: "Wallet History", description: "Opening transaction history..." })}
          />
        </div>

        <Tabs defaultValue="vehicles">
          <TabsList>
            <TabsTrigger value="vehicles" data-testid="tab-vehicles">
              <Car className="h-4 w-4 mr-2" />
              My Vehicles
            </TabsTrigger>
            <TabsTrigger value="services" data-testid="tab-services">
              <Wrench className="h-4 w-4 mr-2" />
              Service History
            </TabsTrigger>
            <TabsTrigger value="transactions" data-testid="tab-transactions">
              <History className="h-4 w-4 mr-2" />
              Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {mockVehicles.map((vehicle) => (
                <Card key={vehicle.id} data-testid={`vehicle-card-${vehicle.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                        <Car className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                        <p className="text-sm text-muted-foreground">Plate: {vehicle.plate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">Book Service</Button>
                      <Button variant="outline" size="sm">View History</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Card className="border-dashed">
                <CardContent className="p-4 flex items-center justify-center h-full min-h-[120px]">
                  <Button variant="ghost" data-testid="button-add-vehicle">
                    + Add Vehicle
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {mockServiceHistory.map((service) => (
                    <div key={service.id} className="p-4 flex items-center justify-between" data-testid={`service-history-${service.id}`}>
                      <div>
                        <h3 className="font-medium">{service.service}</h3>
                        <p className="text-sm text-muted-foreground">{service.vehicle}</p>
                        <p className="text-xs text-muted-foreground">{service.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${service.amount}</p>
                        <p className="text-sm text-green-600 dark:text-green-400">{service.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="mt-4">
            <WalletTransactions transactions={mockWalletTransactions} />
          </TabsContent>
        </Tabs>
      </main>

      <TopUpDialog
        open={topUpOpen}
        onOpenChange={setTopUpOpen}
        onSubmit={(amount) => toast({ title: "Top-up Successful", description: `$${amount} added to your wallet` })}
      />
      <PaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        amount={100}
        description="Service Payment"
        walletBalance={mockMember.walletBalance}
        onSubmit={() => toast({ title: "Payment Successful", description: "Thank you for your payment!" })}
      />
    </div>
  );
}
