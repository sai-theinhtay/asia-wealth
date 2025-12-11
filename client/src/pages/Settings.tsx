import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: "Settings Saved", description: "Your preferences have been updated" });
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Settings</h1>
        <p className="text-muted-foreground">Manage your shop preferences and account</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shop Information</CardTitle>
          <CardDescription>Update your business details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="shopName">Shop Name</Label>
              <Input id="shopName" defaultValue="AutoPro Motors" data-testid="input-shop-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="(555) 000-1234" data-testid="input-phone" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" defaultValue="123 Auto Drive, Motor City, MC 12345" data-testid="input-address" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input id="email" type="email" defaultValue="contact@autopro.com" data-testid="input-email" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="darkMode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
            </div>
            <Switch
              id="darkMode"
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
              data-testid="switch-dark-mode"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotif">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch id="emailNotif" defaultChecked data-testid="switch-email-notif" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="lowStock">Low Stock Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when inventory is low</p>
            </div>
            <Switch id="lowStock" defaultChecked data-testid="switch-low-stock" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="serviceReminder">Service Reminders</Label>
              <p className="text-sm text-muted-foreground">Send reminders to customers</p>
            </div>
            <Switch id="serviceReminder" defaultChecked data-testid="switch-service-reminder" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} data-testid="button-save-settings">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
