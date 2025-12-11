import { useState } from "react";
import { useLocation } from "wouter";
import { Car, Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export default function MemberLogin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await fetch("/api/auth/member/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errMsg = "Login failed";
        try {
          const payload = await response.json();
          errMsg = payload?.message || errMsg;
        } catch {
          errMsg = response.statusText || errMsg;
        }
        throw new Error(errMsg);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Login Successful", description: "Welcome back to AutoPro!" });
      setLocation("/member-portal");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      toast({ title: "Login Failed", description: message, variant: "destructive" });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; phone: string; password: string }) => {
      const response = await fetch("/api/auth/member/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errMsg = "Registration failed";
        try {
          const payload = await response.json();
          errMsg = payload?.message || errMsg;
        } catch {
          errMsg = response.statusText || errMsg;
        }
        throw new Error(errMsg);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Registration Successful", description: "Your account has been created!" });
      setLocation("/member-portal");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      toast({ title: "Registration Failed", description: message, variant: "destructive" });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (registerData.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    registerMutation.mutate({
      name: registerData.name,
      email: registerData.email,
      phone: registerData.phone,
      password: registerData.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
            <Car className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-3xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">AutoPro</span>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="login" data-testid="tab-login" className="rounded-md">Login</TabsTrigger>
            <TabsTrigger value="register" data-testid="tab-register" className="rounded-md">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="shadow-xl border-2">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl">Member Login</CardTitle>
                <CardDescription className="text-base">
                  Access your account to view services, points, and wallet.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loginEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="loginEmail"
                        name="email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        placeholder="member@email.com"
                        autoComplete="email"
                        className="pl-9"
                        required
                        data-testid="input-login-email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loginPassword">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="loginPassword"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="Enter password"
                        autoComplete="current-password"
                        className="pl-9 pr-9"
                        required
                        data-testid="input-login-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button variant="ghost" className="p-0 h-auto text-sm" type="button">
                      Forgot password?
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-shadow" 
                    data-testid="button-login"
                    disabled={loginMutation.status === "pending"}
                  >
                    {loginMutation.status === "pending" ? "Logging in..." : "Login"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="shadow-xl border-2">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <CardDescription className="text-base">
                  Register to earn points and manage your services.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="registerName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="registerName"
                        name="name"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        placeholder="John Smith"
                        className="pl-9"
                        required
                        data-testid="input-register-name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="registerEmail"
                        name="email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        placeholder="member@email.com"
                        autoComplete="email"
                        className="pl-9"
                        required
                        data-testid="input-register-email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerPhone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="registerPhone"
                        name="phone"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className="pl-9"
                        required
                        data-testid="input-register-phone"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="registerPassword">Password</Label>
                      <Input
                        id="registerPassword"
                        name="password"
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        placeholder="Password"
                        autoComplete="new-password"
                        required
                        data-testid="input-register-password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        placeholder="Confirm"
                        autoComplete="new-password"
                        required
                        data-testid="input-confirm-password"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-shadow" 
                    data-testid="button-register"
                    disabled={registerMutation.status === "pending"}
                  >
                    {registerMutation.status === "pending" ? "Creating Account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-muted-foreground mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
