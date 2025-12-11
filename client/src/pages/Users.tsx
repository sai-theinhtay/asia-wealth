import { useState } from "react";
import { Plus, Search, MoreVertical, Edit, Trash2, Key } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRoleBadge, type UserRole } from "@/components/UserRoleBadge";
import { UserFormDialog } from "@/components/UserFormDialog";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@autopro.com", phone: "(555) 000-1234", role: "admin" as UserRole, branch: "Main", status: "active", lastLogin: "2h ago" },
  { id: "2", name: "Jane Smith", email: "jane@autopro.com", phone: "(555) 111-2345", role: "subadmin" as UserRole, branch: "Downtown", status: "active", lastLogin: "1d ago" },
  { id: "3", name: "Mike Wilson", email: "mike@autopro.com", phone: "(555) 222-3456", role: "subadmin" as UserRole, branch: "Westside", status: "active", lastLogin: "3h ago" },
  { id: "4", name: "Sarah Johnson", email: "sarah@autopro.com", phone: "(555) 333-4567", role: "staff" as UserRole, branch: "Main", status: "active", lastLogin: "5h ago" },
  { id: "5", name: "David Chen", email: "david@autopro.com", phone: "(555) 444-5678", role: "staff" as UserRole, branch: "Downtown", status: "inactive", lastLogin: "1w ago" },
];

export default function Users() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = mockUsers.filter((user) =>
    `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: mockUsers.length,
    admins: mockUsers.filter((u) => u.role === "admin").length,
    subadmins: mockUsers.filter((u) => u.role === "subadmin").length,
    staff: mockUsers.filter((u) => u.role === "staff").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">User Management</h1>
          <p className="text-muted-foreground text-lg">Manage admin, sub-admin, and staff accounts</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} size="lg" data-testid="button-add-user" className="shadow-md hover:shadow-lg transition-shadow">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight text-red-600 dark:text-red-400">{stats.admins}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sub-Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight text-orange-600 dark:text-orange-400">{stats.subadmins}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">{stats.staff}</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          data-testid="input-search"
        />
      </div>

      <Card className="shadow-sm border-2">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Branch</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Last Login</TableHead>
              <TableHead className="w-[80px] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/30 transition-colors cursor-pointer border-b" data-testid={`user-row-${user.id}`}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <UserRoleBadge role={user.role} />
                </TableCell>
                <TableCell>{user.branch}</TableCell>
                <TableCell>
                  <Badge
                    className={`border-0 ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" data-testid={`button-menu-${user.id}`}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toast({ title: "Edit User", description: `Editing ${user.name}` })}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast({ title: "Reset Password", description: `Password reset sent to ${user.email}` })}>
                        <Key className="h-4 w-4 mr-2" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => toast({ title: "Delete User", description: `${user.name} would be deleted` })}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(data) => toast({ title: "User Created", description: `${data.name} has been added as ${data.role}` })}
      />
    </div>
  );
}
