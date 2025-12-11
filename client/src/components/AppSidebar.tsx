import { useLocation, Link } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import RoleBadge from "@/components/RoleBadge";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  Car, 
  Wrench, 
  Package, 
  DollarSign, 
  Users,
  Settings,
  Cog,
  Building2,
  UserCog
} from "lucide-react";

type MenuItem = {
  title: string;
  url: string;
  icon: any;
  allowedRoles?: string[]; // undefined => visible to all
};

const menuItems: MenuItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Sales", url: "/sales", icon: Car, allowedRoles: ["admin", "owner", "repair_staff"] },
  { title: "Parts", url: "/parts", icon: Cog, allowedRoles: ["admin", "owner", "repair_staff"] },
  { title: "Service", url: "/service", icon: Wrench, allowedRoles: ["admin", "owner", "repair_staff"] },
  { title: "Inventory", url: "/inventory", icon: Package, allowedRoles: ["admin", "owner"] },
  { title: "Finance", url: "/finance", icon: DollarSign, allowedRoles: ["admin", "owner"] },
  { title: "Members", url: "/members", icon: Users, allowedRoles: ["admin", "owner"] },
  { title: "Users", url: "/users", icon: UserCog, allowedRoles: ["admin", "owner"] },
  { title: "Branches", url: "/branches", icon: Building2, allowedRoles: ["admin", "owner"] },
  { title: "Reports", url: "/report-error", icon: Wrench, allowedRoles: ["repair_staff", "admin", "owner"] },
  { title: "Owner", url: "/owner-dashboard", icon: Building2, allowedRoles: ["owner"] },
  { title: "My History", url: "/client-history", icon: Users, allowedRoles: ["member"] },
];

export function AppSidebar() {
  const [location] = useLocation();
  const auth = useAuth();
  const user = auth.data?.user;
  const role = auth.data?.userType;

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md group-hover:shadow-lg transition-shadow">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent" data-testid="text-brand-name">AutoPro</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                // If the item has an allowedRoles list, hide if current role not allowed
                if (item.allowedRoles && !(role && item.allowedRoles.includes(role))) return null;
                const isActive = location === item.url || 
                  (item.url !== "/" && location.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url} data-testid={`link-${item.title.toLowerCase()}`}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
              {user?.name ? String(user.name).slice(0,2).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'Guest'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <RoleBadge role={role} />
            <SidebarMenuButton asChild className="h-8 w-8 p-0">
              <Link href="/settings" data-testid="link-settings">
                <Settings className="h-4 w-4" />
              </Link>
            </SidebarMenuButton>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
