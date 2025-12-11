import { useState } from "react";
import { Plus, Search, Users, Crown, Coins, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MemberLevelBadge, type MemberLevel } from "@/components/MemberLevelBadge";
import { MemberFormDialog } from "@/components/MemberFormDialog";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockMembers = [
  { id: "1", name: "John Smith", email: "john.smith@email.com", phone: "(555) 123-4567", level: "gold" as MemberLevel, points: 2450, walletBalance: 350, vehicleCount: 2, serviceCount: 8 },
  { id: "2", name: "Sarah Johnson", email: "sarah.j@email.com", phone: "(555) 234-5678", level: "silver" as MemberLevel, points: 1200, walletBalance: 150, vehicleCount: 1, serviceCount: 5 },
  { id: "3", name: "Mike Wilson", email: "mike.wilson@email.com", phone: "(555) 345-6789", level: "platinum" as MemberLevel, points: 5800, walletBalance: 820, vehicleCount: 3, serviceCount: 12 },
  { id: "4", name: "Emily Davis", email: "emily.d@email.com", phone: "(555) 456-7890", level: "bronze" as MemberLevel, points: 450, walletBalance: 0, vehicleCount: 1, serviceCount: 3 },
  { id: "5", name: "David Chen", email: "david.chen@email.com", phone: "(555) 567-8901", level: "gold" as MemberLevel, points: 3200, walletBalance: 200, vehicleCount: 2, serviceCount: 6 },
  { id: "6", name: "Jennifer Brown", email: "j.brown@email.com", phone: "(555) 678-9012", level: "silver" as MemberLevel, points: 980, walletBalance: 75, vehicleCount: 1, serviceCount: 4 },
];

export default function Members() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = mockMembers.filter((m) =>
    `${m.name} ${m.email} ${m.phone}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: mockMembers.length,
    totalPoints: mockMembers.reduce((sum, m) => sum + m.points, 0),
    totalWallet: mockMembers.reduce((sum, m) => sum + m.walletBalance, 0),
    platinum: mockMembers.filter((m) => m.level === "platinum").length,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">Members</h1>
          <p className="text-muted-foreground text-lg">Manage customers, levels, points, and wallets</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} size="lg" data-testid="button-add-member" className="shadow-md hover:shadow-lg transition-shadow">
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              Total Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-900/30">
                <Coins className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">{stats.totalPoints.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30">
                <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              Wallet Balances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">${stats.totalWallet.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30">
                <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              Platinum Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight text-purple-600 dark:text-purple-400">{stats.platinum}</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <Input
          placeholder="Search members by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-11 shadow-sm focus:shadow-md transition-shadow"
          data-testid="input-search"
        />
      </div>

      <Card className="shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Member</TableHead>
              <TableHead className="font-semibold">Level</TableHead>
              <TableHead className="font-semibold">Points</TableHead>
              <TableHead className="font-semibold">Wallet</TableHead>
              <TableHead className="font-semibold">Vehicles</TableHead>
              <TableHead className="font-semibold">Services</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow 
                key={member.id} 
                className="hover:bg-muted/30 transition-colors cursor-pointer border-b" 
                data-testid={`member-row-${member.id}`}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <MemberLevelBadge level={member.level} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Coins className="h-3 w-3 text-yellow-500" />
                    <span className="font-medium">{member.points.toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    ${member.walletBalance.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>{member.vehicleCount}</TableCell>
                <TableCell>{member.serviceCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No members found matching your search.</p>
        </div>
      )}

      <MemberFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(data) => toast({ title: "Member Added", description: `${data.name} has been registered` })}
      />
    </div>
  );
}
