import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMemberSchema, insertCartItemSchema } from "@shared/schema";
import { hashPassword, authenticateMember, authenticateUser } from "./auth";
import { z } from "zod";

// Extend Express Request to include session
declare module "express-session" {
  interface SessionData {
    memberId?: string;
    userId?: string;
    userType?: "member" | "admin" | "repair_staff" | "owner";
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Members API
  app.get("/api/members", async (req: Request, res: Response) => {
    try {
      const members = await storage.getMembers();
      res.json(members);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/members/:id", async (req: Request, res: Response) => {
    try {
      const member = await storage.getMember(req.params.id);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.json(member);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/members", async (req: Request, res: Response) => {
    try {
      const data = insertMemberSchema.parse(req.body);
      const member = await storage.createMember(data);
      res.status(201).json(member);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/members/:id", async (req: Request, res: Response) => {
    try {
      const member = await storage.updateMember(req.params.id, req.body);
      res.json(member);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/members/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteMember(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Member Levels API
  app.get("/api/member-levels", async (req: Request, res: Response) => {
    try {
      const levels = await storage.getMemberLevels();
      res.json(levels);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Points API
  app.post("/api/members/:id/points/add", async (req: Request, res: Response) => {
    try {
      const { amount, description, referenceId } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      const transaction = await storage.addPoints(
        req.params.id,
        amount,
        description || "Points added",
        referenceId
      );
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/members/:id/points/spend", async (req: Request, res: Response) => {
    try {
      const { amount, description, referenceId } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      const transaction = await storage.spendPoints(
        req.params.id,
        amount,
        description || "Points spent",
        referenceId
      );
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/members/:id/points/transactions", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const transactions = await storage.getPointsTransactions(req.params.id, limit);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Wallet API
  app.post("/api/members/:id/wallet/topup", async (req: Request, res: Response) => {
    try {
      const { amount, description } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      const transaction = await storage.topUpWallet(
        req.params.id,
        amount,
        description || "Wallet top-up"
      );
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/members/:id/wallet/deduct", async (req: Request, res: Response) => {
    try {
      const { amount, description, referenceId } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      const transaction = await storage.deductWallet(
        req.params.id,
        amount,
        description || "Payment",
        referenceId
      );
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/members/:id/wallet/refund", async (req: Request, res: Response) => {
    try {
      const { amount, description, referenceId } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      const transaction = await storage.refundWallet(
        req.params.id,
        amount,
        description || "Refund",
        referenceId
      );
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/members/:id/wallet/transactions", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const transactions = await storage.getWalletTransactions(req.params.id, limit);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Cart API
  app.get("/api/members/:id/cart", async (req: Request, res: Response) => {
    try {
      let cart = await storage.getActiveCart(req.params.id);
      if (!cart) {
        cart = await storage.createCart(req.params.id);
      }
      const items = await storage.getCartItems(cart.id);
      const total = await storage.getCartTotal(cart.id);
      res.json({ ...cart, items, total });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/carts/:cartId/items", async (req: Request, res: Response) => {
    try {
      const data = insertCartItemSchema.parse(req.body);
      const item = await storage.addCartItem(req.params.cartId, data);
      res.status(201).json(item);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/cart-items/:id", async (req: Request, res: Response) => {
    try {
      const { quantity } = req.body;
      if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      const item = await storage.updateCartItem(req.params.id, quantity);
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/cart-items/:id", async (req: Request, res: Response) => {
    try {
      await storage.removeCartItem(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/carts/:cartId/clear", async (req: Request, res: Response) => {
    try {
      await storage.clearCart(req.params.cartId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/carts/:cartId/complete", async (req: Request, res: Response) => {
    try {
      const cart = await storage.completeCart(req.params.cartId);
      res.json(cart);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Authentication Routes - Members
  app.post("/api/auth/member/register", async (req: Request, res: Response) => {
    try {
      const data = insertMemberSchema.parse(req.body);
      const hashedPassword = await hashPassword(data.password);
      const member = await storage.createMember({
        ...data,
        password: hashedPassword,
      });
      
      // Auto-login after registration
      req.session.memberId = member.id;
      req.session.userType = "member";
      
      // Don't send password
      const { password, ...memberWithoutPassword } = member;
      res.status(201).json({ member: memberWithoutPassword, message: "Registration successful" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      if (error.message?.includes("unique") || error.message?.includes("duplicate")) {
        return res.status(409).json({ message: "Email already registered" });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/member/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const member = await authenticateMember(email, password);
      if (!member) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      req.session.memberId = member.id;
      req.session.userType = "member";

      // Don't send password
      const { password: _, ...memberWithoutPassword } = member;
      res.json({ member: memberWithoutPassword, message: "Login successful" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/member/logout", async (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/member/me", async (req: Request, res: Response) => {
    try {
      if (!req.session.memberId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const member = await storage.getMember(req.session.memberId);
      if (!member) {
        req.session.destroy(() => {});
        return res.status(404).json({ message: "Member not found" });
      }

      // Don't send password
      const { password, ...memberWithoutPassword } = member;
      res.json(memberWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Authentication Routes - Admin/Staff
  app.post("/api/auth/admin/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await authenticateUser(username, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      req.session.userId = user.id;
      req.session.userType = "admin";

      // Don't send password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, message: "Login successful" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/admin/logout", async (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/admin/me", async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        req.session.destroy(() => {});
        return res.status(404).json({ message: "User not found" });
      }

      // Don't send password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Unified current user endpoint
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const userType = req.session.userType;
      if (userType === "member") {
        if (!req.session.memberId) return res.status(401).json({ message: "Not authenticated" });
        const member = await storage.getMember(req.session.memberId);
        if (!member) return res.status(404).json({ message: "Member not found" });
        const { password, ...memberWithoutPassword } = member as any;
        return res.json({ userType: "member", user: memberWithoutPassword });
      }
      if (userType === "admin" || userType === "owner" || userType === "repair_staff") {
        if (!req.session.userId) return res.status(401).json({ message: "Not authenticated" });
        const user = await storage.getUser(req.session.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        const { password, ...userWithoutPassword } = user as any;
        return res.json({ userType: userType, user: userWithoutPassword });
      }
      return res.status(401).json({ message: "Not authenticated" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Reports API
  app.post("/api/reports", async (req: Request, res: Response) => {
    try {
      const { title, description } = req.body;
      if (!title || !description) return res.status(400).json({ message: "Title and description required" });
      const reporterId = req.session.memberId || req.session.userId;
      const reporterType = req.session.userType || "unknown";
      if (!reporterId) return res.status(401).json({ message: "Not authenticated" });
      const report = await storage.createReport(reporterId, reporterType, title, description);
      res.status(201).json(report);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/reports", async (req: Request, res: Response) => {
    try {
      // owners and admins can view all reports
      if (req.session.userType === "owner" || req.session.userType === "admin") {
        const reports = await storage.getReports();
        return res.json(reports);
      }
      // members and others only see their own reports
      const reporterId = req.session.memberId || req.session.userId;
      if (!reporterId) return res.status(401).json({ message: "Not authenticated" });
      const reports = await storage.getReportsByReporter(reporterId);
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/reports/mine", async (req: Request, res: Response) => {
    try {
      const reporterId = req.session.memberId || req.session.userId;
      if (!reporterId) return res.status(401).json({ message: "Not authenticated" });
      const reports = await storage.getReportsByReporter(reporterId);
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/reports/:id", async (req: Request, res: Response) => {
    try {
      // only owner or admin may update status/assign
      if (!(req.session.userType === "owner" || req.session.userType === "admin")) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const updated = await storage.updateReport(req.params.id, req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}
