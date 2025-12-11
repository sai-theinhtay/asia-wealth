import { 
  type User, 
  type InsertUser,
  type Member,
  type InsertMember,
  type MemberLevel,
  type InsertMemberLevel,
  type PointsTransaction,
  type InsertPointsTransaction,
  type WalletTransaction,
  type InsertWalletTransaction,
  type Cart,
  type InsertCart,
  type CartItem,
  type InsertCartItem,
  type Report,
  type InsertReport,
  users,
  members,
  memberLevels,
  pointsTransactions,
  walletTransactions,
  carts,
  cartItems,
  reports,
} from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { getDb } from "./db";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Members
  getMember(id: string): Promise<Member | undefined>;
  getMemberByEmail(email: string): Promise<Member | undefined>;
  getMembers(): Promise<Member[]>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: string, data: Partial<Member>): Promise<Member>;
  deleteMember(id: string): Promise<void>;

  // Member Levels
  getMemberLevel(level: "bronze" | "silver" | "gold" | "platinum"): Promise<MemberLevel | undefined>;
  getMemberLevels(): Promise<MemberLevel[]>;
  upsertMemberLevel(level: InsertMemberLevel): Promise<MemberLevel>;
  calculateMemberLevel(points: number): Promise<"bronze" | "silver" | "gold" | "platinum">;
  updateMemberLevel(memberId: string): Promise<void>;

  // Points
  addPoints(memberId: string, amount: number, description: string, referenceId?: string): Promise<PointsTransaction>;
  spendPoints(memberId: string, amount: number, description: string, referenceId?: string): Promise<PointsTransaction>;
  getPointsTransactions(memberId: string, limit?: number): Promise<PointsTransaction[]>;

  // Wallet
  topUpWallet(memberId: string, amount: number, description?: string): Promise<WalletTransaction>;
  deductWallet(memberId: string, amount: number, description: string, referenceId?: string): Promise<WalletTransaction>;
  refundWallet(memberId: string, amount: number, description: string, referenceId?: string): Promise<WalletTransaction>;
  getWalletTransactions(memberId: string, limit?: number): Promise<WalletTransaction[]>;

  // Cart
  getActiveCart(memberId: string): Promise<Cart | undefined>;
  createCart(memberId: string): Promise<Cart>;
  getCartItems(cartId: string): Promise<CartItem[]>;
  addCartItem(cartId: string, item: Omit<InsertCartItem, "cartId" | "subtotal">): Promise<CartItem>;
  updateCartItem(cartItemId: string, quantity: number): Promise<CartItem>;
  removeCartItem(cartItemId: string): Promise<void>;
  clearCart(cartId: string): Promise<void>;
  completeCart(cartId: string): Promise<Cart>;
  getCartTotal(cartId: string): Promise<number>;
  // Reports (for repair staff / owners)
  createReport(reporterId: string, reporterType: string, title: string, description: string): Promise<any>;
  getReports(): Promise<any[]>;
  getReportsByReporter(reporterId: string): Promise<any[]>;
  updateReport(id: string, data: Partial<any>): Promise<any>;
}

export class DbStorage implements IStorage {
  private get db() {
    return getDb();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser & { password: string }): Promise<User> {
    await this.db.insert(users).values({
      username: insertUser.username,
      password: insertUser.password, // Should be hashed before calling this
    });
    const result = await this.db.select().from(users).where(eq(users.username, insertUser.username)).limit(1);
    return result[0];
  }

  // Members
  async getMember(id: string): Promise<Member | undefined> {
    const result = await this.db.select().from(members).where(eq(members.id, id)).limit(1);
    return result[0];
  }

  async getMemberByEmail(email: string): Promise<Member | undefined> {
    const result = await this.db.select().from(members).where(eq(members.email, email)).limit(1);
    return result[0];
  }

  async getMembers(): Promise<Member[]> {
    return await this.db.select().from(members).orderBy(desc(members.createdAt));
  }

  async createMember(memberData: InsertMember): Promise<Member> {
    await this.db.insert(members).values({
      ...memberData,
      level: "bronze",
      points: 0,
      lifetimePoints: 0,
      walletBalance: "0",
    });
    const result = await this.db.select().from(members).where(eq(members.email, memberData.email)).limit(1);
    return result[0];
  }

  async updateMember(id: string, data: Partial<Member>): Promise<Member> {
    await this.db.update(members)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(members.id, id));
    const result = await this.db.select().from(members).where(eq(members.id, id)).limit(1);
    if (!result[0]) throw new Error("Member not found after update");
    return result[0];
  }

  async deleteMember(id: string): Promise<void> {
    await this.db.delete(members).where(eq(members.id, id));
  }

  // Member Levels
  async getMemberLevel(level: "bronze" | "silver" | "gold" | "platinum"): Promise<MemberLevel | undefined> {
    const result = await this.db.select().from(memberLevels).where(eq(memberLevels.level, level)).limit(1);
    return result[0];
  }

  async getMemberLevels(): Promise<MemberLevel[]> {
    return await this.db.select().from(memberLevels).orderBy(memberLevels.minPoints);
  }

  async upsertMemberLevel(levelData: InsertMemberLevel): Promise<MemberLevel> {
    // MySQL uses INSERT ... ON DUPLICATE KEY UPDATE
    await this.db.insert(memberLevels)
      .values(levelData)
      .onDuplicateKeyUpdate({
        set: {
          minPoints: levelData.minPoints,
          pointsEarnRate: levelData.pointsEarnRate,
          discountPercent: levelData.discountPercent,
        },
      });
    const result = await this.db.select()
      .from(memberLevels)
      .where(eq(memberLevels.level, levelData.level))
      .limit(1);
    if (!result[0]) throw new Error("Failed to upsert member level");
    return result[0];
  }

  async calculateMemberLevel(points: number): Promise<"bronze" | "silver" | "gold" | "platinum"> {
    const levels = await this.getMemberLevels();
    // Sort by minPoints descending to find highest level
    const sortedLevels = levels.sort((a, b) => Number(b.minPoints) - Number(a.minPoints));
    for (const level of sortedLevels) {
      if (points >= Number(level.minPoints)) {
        return level.level as "bronze" | "silver" | "gold" | "platinum";
      }
    }
    return "bronze";
  }

  async updateMemberLevel(memberId: string): Promise<void> {
    const member = await this.getMember(memberId);
    if (!member) return;

    const newLevel = await this.calculateMemberLevel(member.points);
    if (newLevel !== member.level) {
      await this.updateMember(memberId, { level: newLevel });
    }
  }

  // Points
  async addPoints(memberId: string, amount: number, description: string, referenceId?: string): Promise<PointsTransaction> {
    const member = await this.getMember(memberId);
    if (!member) throw new Error("Member not found");

    const newPoints = member.points + amount;
    const newLifetimePoints = member.lifetimePoints + amount;

    await this.db.update(members)
      .set({ 
        points: newPoints,
        lifetimePoints: newLifetimePoints,
        updatedAt: new Date(),
      })
      .where(eq(members.id, memberId));

    await this.updateMemberLevel(memberId);

    await this.db.insert(pointsTransactions).values({
      memberId,
      type: "earn",
      amount,
      balance: newPoints,
      description,
      referenceId,
    });
    
    // Get the most recent transaction for this member
    const result = await this.db.select()
      .from(pointsTransactions)
      .where(eq(pointsTransactions.memberId, memberId))
      .orderBy(desc(pointsTransactions.createdAt))
      .limit(1);
    if (!result[0]) throw new Error("Failed to create points transaction");
    return result[0];
  }

  async spendPoints(memberId: string, amount: number, description: string, referenceId?: string): Promise<PointsTransaction> {
    const member = await this.getMember(memberId);
    if (!member) throw new Error("Member not found");
    if (member.points < amount) throw new Error("Insufficient points");

    const newPoints = member.points - amount;

    await this.db.update(members)
      .set({ 
        points: newPoints,
        updatedAt: new Date(),
      })
      .where(eq(members.id, memberId));

    await this.db.insert(pointsTransactions).values({
      memberId,
      type: "spend",
      amount: -amount,
      balance: newPoints,
      description,
      referenceId,
    });
    
    // Get the most recent transaction for this member
    const result = await this.db.select()
      .from(pointsTransactions)
      .where(eq(pointsTransactions.memberId, memberId))
      .orderBy(desc(pointsTransactions.createdAt))
      .limit(1);
    if (!result[0]) throw new Error("Failed to create points transaction");
    return result[0];
  }

  async getPointsTransactions(memberId: string, limit = 50): Promise<PointsTransaction[]> {
    return await this.db.select()
      .from(pointsTransactions)
      .where(eq(pointsTransactions.memberId, memberId))
      .orderBy(desc(pointsTransactions.createdAt))
      .limit(limit);
  }

  // Wallet
  async topUpWallet(memberId: string, amount: number, description = "Wallet Top-up"): Promise<WalletTransaction> {
    const member = await this.getMember(memberId);
    if (!member) throw new Error("Member not found");

    const currentBalance = Number(member.walletBalance);
    const newBalance = currentBalance + amount;

    await this.db.update(members)
      .set({ 
        walletBalance: newBalance.toString(),
        updatedAt: new Date(),
      })
      .where(eq(members.id, memberId));

    await this.db.insert(walletTransactions).values({
      memberId,
      type: "topup",
      amount: amount.toString(),
      balance: newBalance.toString(),
      description,
    });
    
    // Get the most recent transaction for this member
    const result = await this.db.select()
      .from(walletTransactions)
      .where(eq(walletTransactions.memberId, memberId))
      .orderBy(desc(walletTransactions.createdAt))
      .limit(1);
    if (!result[0]) throw new Error("Failed to create wallet transaction");
    return result[0];
  }

  async deductWallet(memberId: string, amount: number, description: string, referenceId?: string): Promise<WalletTransaction> {
    const member = await this.getMember(memberId);
    if (!member) throw new Error("Member not found");

    const currentBalance = Number(member.walletBalance);
    if (currentBalance < amount) throw new Error("Insufficient wallet balance");

    const newBalance = currentBalance - amount;

    await this.db.update(members)
      .set({ 
        walletBalance: newBalance.toString(),
        updatedAt: new Date(),
      })
      .where(eq(members.id, memberId));

    await this.db.insert(walletTransactions).values({
      memberId,
      type: "payment",
      amount: (-amount).toString(),
      balance: newBalance.toString(),
      description,
      referenceId,
    });
    
    // Get the most recent transaction for this member
    const result = await this.db.select()
      .from(walletTransactions)
      .where(eq(walletTransactions.memberId, memberId))
      .orderBy(desc(walletTransactions.createdAt))
      .limit(1);
    if (!result[0]) throw new Error("Failed to create wallet transaction");
    return result[0];
  }

  async refundWallet(memberId: string, amount: number, description: string, referenceId?: string): Promise<WalletTransaction> {
    const member = await this.getMember(memberId);
    if (!member) throw new Error("Member not found");

    const currentBalance = Number(member.walletBalance);
    const newBalance = currentBalance + amount;

    await this.db.update(members)
      .set({ 
        walletBalance: newBalance.toString(),
        updatedAt: new Date(),
      })
      .where(eq(members.id, memberId));

    await this.db.insert(walletTransactions).values({
      memberId,
      type: "refund",
      amount: amount.toString(),
      balance: newBalance.toString(),
      description,
      referenceId,
    });
    
    // Get the most recent transaction for this member
    const result = await this.db.select()
      .from(walletTransactions)
      .where(eq(walletTransactions.memberId, memberId))
      .orderBy(desc(walletTransactions.createdAt))
      .limit(1);
    if (!result[0]) throw new Error("Failed to create wallet transaction");
    return result[0];
  }

  async getWalletTransactions(memberId: string, limit = 50): Promise<WalletTransaction[]> {
    return await this.db.select()
      .from(walletTransactions)
      .where(eq(walletTransactions.memberId, memberId))
      .orderBy(desc(walletTransactions.createdAt))
      .limit(limit);
  }

  // Cart
  async getActiveCart(memberId: string): Promise<Cart | undefined> {
    const result = await this.db.select()
      .from(carts)
      .where(and(
        eq(carts.memberId, memberId),
        eq(carts.status, "active")
      ))
      .limit(1);
    return result[0];
  }

  async createCart(memberId: string): Promise<Cart> {
    await this.db.insert(carts).values({
      memberId,
      status: "active",
    });
    // Get the most recent active cart for this member
    const result = await this.db.select()
      .from(carts)
      .where(and(
        eq(carts.memberId, memberId),
        eq(carts.status, "active")
      ))
      .orderBy(desc(carts.createdAt))
      .limit(1);
    if (!result[0]) throw new Error("Failed to create cart");
    return result[0];
  }

  async getCartItems(cartId: string): Promise<CartItem[]> {
    return await this.db.select()
      .from(cartItems)
      .where(eq(cartItems.cartId, cartId))
      .orderBy(cartItems.createdAt);
  }

  async addCartItem(cartId: string, item: Omit<InsertCartItem, "cartId" | "subtotal">): Promise<CartItem> {
    const subtotal = Number(item.price) * (item.quantity || 1);
    await this.db.insert(cartItems).values({
      ...item,
      cartId,
      subtotal: subtotal.toString(),
    });

    // Update cart updatedAt
    await this.db.update(carts)
      .set({ updatedAt: new Date() })
      .where(eq(carts.id, cartId));

    // Get the most recent item for this cart
    const result = await this.db.select()
      .from(cartItems)
      .where(eq(cartItems.cartId, cartId))
      .orderBy(desc(cartItems.createdAt))
      .limit(1);
    if (!result[0]) throw new Error("Failed to create cart item");
    return result[0];
  }

  async updateCartItem(cartItemId: string, quantity: number): Promise<CartItem> {
    const item = await this.db.select().from(cartItems).where(eq(cartItems.id, cartItemId)).limit(1);
    if (!item[0]) throw new Error("Cart item not found");

    const subtotal = Number(item[0].price) * quantity;
    await this.db.update(cartItems)
      .set({ quantity, subtotal: subtotal.toString() })
      .where(eq(cartItems.id, cartItemId));

    // Update cart updatedAt
    await this.db.update(carts)
      .set({ updatedAt: new Date() })
      .where(eq(carts.id, item[0].cartId));

    const result = await this.db.select()
      .from(cartItems)
      .where(eq(cartItems.id, cartItemId))
      .limit(1);
    if (!result[0]) throw new Error("Cart item not found after update");
    return result[0];
  }

  async removeCartItem(cartItemId: string): Promise<void> {
    const item = await this.db.select().from(cartItems).where(eq(cartItems.id, cartItemId)).limit(1);
    if (!item[0]) return;

    await this.db.delete(cartItems).where(eq(cartItems.id, cartItemId));

    // Update cart updatedAt
    await this.db.update(carts)
      .set({ updatedAt: new Date() })
      .where(eq(carts.id, item[0].cartId));
  }

  async clearCart(cartId: string): Promise<void> {
    await this.db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    await this.db.update(carts)
      .set({ updatedAt: new Date() })
      .where(eq(carts.id, cartId));
  }

  async completeCart(cartId: string): Promise<Cart> {
    await this.db.update(carts)
      .set({ status: "completed", updatedAt: new Date() })
      .where(eq(carts.id, cartId));
    const result = await this.db.select()
      .from(carts)
      .where(eq(carts.id, cartId))
      .limit(1);
    if (!result[0]) throw new Error("Cart not found after completion");
    return result[0];
  }

  async getCartTotal(cartId: string): Promise<number> {
    const result = await this.db.select({
      total: sql<number>`COALESCE(SUM(${cartItems.subtotal}), 0)`,
    })
      .from(cartItems)
      .where(eq(cartItems.cartId, cartId));
    return Number(result[0]?.total || 0);
  }
  // Reports
  async createReport(reporterId: string, reporterType: string, title: string, description: string): Promise<Report> {
    const id = randomUUID();
    const now = new Date();
    await this.db.insert(reports).values({
      id,
      reporterId,
      reporterType: reporterType as any,
      title,
      description,
      status: "open",
      createdAt: now,
      updatedAt: now,
    });
    const result = await this.db.select().from(reports).where(eq(reports.id, id)).limit(1);
    return result[0];
  }

  async getReports(): Promise<Report[]> {
    return await this.db.select().from(reports).orderBy(desc(reports.createdAt));
  }

  async getReportsByReporter(reporterId: string): Promise<Report[]> {
    return await this.db.select().from(reports).where(eq(reports.reporterId, reporterId)).orderBy(desc(reports.createdAt));
  }

  async updateReport(id: string, data: Partial<Report>): Promise<Report> {
    const updateData: any = { ...data, updatedAt: new Date() };
    if (updateData.status === "resolved") updateData.resolvedAt = new Date();
    await this.db.update(reports).set(updateData).where(eq(reports.id, id));
    const result = await this.db.select().from(reports).where(eq(reports.id, id)).limit(1);
    if (!result[0]) throw new Error("Report not found after update");
    return result[0];
  }
}

// Use database storage if DATABASE_URL is set, otherwise fallback to memory
export const storage: IStorage = process.env.DATABASE_URL 
  ? new DbStorage()
  : new (class MemStorage implements IStorage {
      private users: Map<string, User> = new Map();
      private members: Map<string, Member> = new Map();

      async getUser(id: string) { return this.users.get(id); }
      async getUserByUsername(username: string) {
        return Array.from(this.users.values()).find(u => u.username === username);
      }
      async createUser(user: InsertUser) {
        const id = randomUUID();
        const newUser: User = { ...user, id };
        this.users.set(id, newUser);
        return newUser;
      }

      async getMember(id: string) { return this.members.get(id); }
      async getMemberByEmail(email: string) {
        return Array.from(this.members.values()).find(m => m.email === email);
      }
      async getMembers() { return Array.from(this.members.values()); }
      async createMember(member: InsertMember) {
        const id = randomUUID();
        const newMember: Member = {
          id,
          name: member.name,
          email: member.email,
          phone: member.phone || null,
          address: member.address || null,
          password: member.password,
          notes: member.notes || null,
          level: "bronze",
          points: 0,
          lifetimePoints: 0,
          walletBalance: "0",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.members.set(id, newMember);
        return newMember;
      }
      private reports: Map<string, any> = new Map();

      async createReport(reporterId: string, reporterType: string, title: string, description: string) {
        const id = randomUUID();
        const now = new Date();
        const report = {
          id,
          reporterId,
          reporterType,
          title,
          description,
          status: "open",
          createdAt: now,
          updatedAt: now,
        };
        this.reports.set(id, report);
        return report;
      }

      async getReports() {
        return Array.from(this.reports.values()).sort((a, b) => (b.createdAt as any) - (a.createdAt as any));
      }

      async getReportsByReporter(reporterId: string) {
        return Array.from(this.reports.values()).filter(r => r.reporterId === reporterId).sort((a, b) => (b.createdAt as any) - (a.createdAt as any));
      }

      async updateReport(id: string, data: Partial<any>) {
        const report = this.reports.get(id);
        if (!report) throw new Error("Report not found");
        const updated = { ...report, ...data, updatedAt: new Date() };
        this.reports.set(id, updated);
        return updated;
      }
      async updateMember(id: string, data: Partial<Member>) {
        const member = this.members.get(id);
        if (!member) throw new Error("Member not found");
        const updated = { ...member, ...data, updatedAt: new Date() };
        this.members.set(id, updated);
        return updated;
      }
      async deleteMember(id: string) { this.members.delete(id); }

      async getMemberLevel(level: "bronze" | "silver" | "gold" | "platinum") { return undefined; }
      async getMemberLevels() { return []; }
      async upsertMemberLevel(level: InsertMemberLevel): Promise<MemberLevel> {
        throw new Error("Not implemented in memory storage");
      }
      async calculateMemberLevel(points: number): Promise<"bronze" | "silver" | "gold" | "platinum"> {
        return "bronze";
      }
      async updateMemberLevel(memberId: string) {}

      async addPoints(memberId: string, amount: number, description: string, referenceId?: string): Promise<PointsTransaction> {
        throw new Error("Not implemented in memory storage");
      }
      async spendPoints(memberId: string, amount: number, description: string, referenceId?: string): Promise<PointsTransaction> {
        throw new Error("Not implemented in memory storage");
      }
      async getPointsTransactions(memberId: string, limit = 50) { return []; }

      async topUpWallet(memberId: string, amount: number, description?: string): Promise<WalletTransaction> {
        throw new Error("Not implemented in memory storage");
      }
      async deductWallet(memberId: string, amount: number, description: string, referenceId?: string): Promise<WalletTransaction> {
        throw new Error("Not implemented in memory storage");
      }
      async refundWallet(memberId: string, amount: number, description: string, referenceId?: string): Promise<WalletTransaction> {
        throw new Error("Not implemented in memory storage");
      }
      async getWalletTransactions(memberId: string, limit = 50) { return []; }

      async getActiveCart(memberId: string) { return undefined; }
      async createCart(memberId: string): Promise<Cart> {
        throw new Error("Not implemented in memory storage");
      }
      async getCartItems(cartId: string) { return []; }
      async addCartItem(cartId: string, item: Omit<InsertCartItem, "cartId" | "subtotal">): Promise<CartItem> {
        throw new Error("Not implemented in memory storage");
      }
      async updateCartItem(cartItemId: string, quantity: number): Promise<CartItem> {
        throw new Error("Not implemented in memory storage");
      }
      async removeCartItem(cartItemId: string) {}
      async clearCart(cartId: string) {}
      async completeCart(cartId: string): Promise<Cart> {
        throw new Error("Not implemented in memory storage");
      }
      async getCartTotal(cartId: string) { return 0; }
    })();
