import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppSidebar } from "@/components/AppSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

import Dashboard from "@/pages/Dashboard";
import Sales from "@/pages/Sales";
import Parts from "@/pages/Parts";
import Service from "@/pages/Service";
import Inventory from "@/pages/Inventory";
import Finance from "@/pages/Finance";
import Members from "@/pages/Members";
import Users from "@/pages/Users";
import Branches from "@/pages/Branches";
import Settings from "@/pages/Settings";
import MemberLogin from "@/pages/MemberLogin";
import AdminLogin from "@/pages/AdminLogin";
import MemberPortal from "@/pages/MemberPortal";
import Cart from "@/pages/Cart";
import NotFound from "@/pages/not-found";
import ReportError from "@/pages/ReportError";
import OwnerDashboard from "@/pages/OwnerDashboard";
import ClientHistory from "@/pages/ClientHistory";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageContainer from "@/components/PageContainer";

function Router() {
  const routes = [
    { path: "/", component: Dashboard },
    { path: "/sales", component: Sales },
    { path: "/parts", component: Parts },
    { path: "/service", component: Service },
    { path: "/inventory", component: Inventory },
    { path: "/finance", component: Finance },
    { path: "/members", component: Members },
    { path: "/users", component: Users },
    { path: "/branches", component: Branches },
    { path: "/settings", component: Settings },
    // Keep login pages full width
    { path: "/member-login", component: MemberLogin, fullWidth: true },
    { path: "/admin-login", component: AdminLogin, fullWidth: true },
    { path: "/member-portal", component: MemberPortal },
    { path: "/cart", component: Cart },
    { path: "/report-error", component: ReportError },
    { path: "/owner-dashboard", component: OwnerDashboard },
    { path: "/client-history", component: ClientHistory },
  ];

  return (
    <Switch>
      {routes.map((r) => (
        <Route
          key={r.path}
          path={r.path}
        >
          {() => (
            r.fullWidth ? (
              <r.component />
            ) : (
              <PageContainer>
                <r.component />
              </PageContainer>
            )
          )}
        </Route>
      ))}
      <Route>
        {() => (
          <PageContainer>
            <NotFound />
          </PageContainer>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 min-w-0 bg-slate-50">
                <header className="flex items-center justify-between gap-4 px-6 h-20 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow">
                  <div className="flex items-center gap-3">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                    <div className="flex items-center gap-3">
                      <img src="/logo192.png" alt="logo" className="h-10 w-10 rounded-lg shadow-sm" />
                      <div>
                        <div className="text-lg font-bold">AutoPro</div>
                        <div className="text-xs text-muted-foreground">Garage & Repair Management</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 px-6">
                    <div className="max-w-2xl mx-auto">
                      <div className="relative">
                        <input aria-label="Search" placeholder="Search members, parts, services..." className="w-full px-4 py-3 rounded-lg border shadow-sm text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ThemeToggle />
                  </div>
                </header>

                <ScrollArea className="flex-1">
                  <main className="p-6">
                    <div className="max-w-7xl mx-auto">
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <Router />
                      </div>
                    </div>
                  </main>
                </ScrollArea>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
