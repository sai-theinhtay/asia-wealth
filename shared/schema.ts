import { sql } from "drizzle-orm";
import { mysqlTable, text, varchar, int, decimal, timestamp, boolean, mysqlEnum } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (admin/staff)
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Members table
export const members = mysqlTable("members", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  password: varchar("password", { length: 255 }).notNull(), // For member login
  level: mysqlEnum("level", ["bronze", "silver", "gold", "platinum"]).notNull().default("bronze"),
  points: int("points").notNull().default(0),
  lifetimePoints: int("lifetime_points").notNull().default(0),
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).notNull().default("0"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMemberSchema = createInsertSchema(members, {
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  password: z.string().min(1),
  notes: z.string().optional(),
}).pick({
  name: true,
  email: true,
  phone: true,
  address: true,
  password: true,
  notes: true,
});

export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;

// Member level thresholds (configurable)
export const memberLevels = mysqlTable("member_levels", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  level: mysqlEnum("level", ["bronze", "silver", "gold", "platinum"]).notNull().unique(),
  minPoints: int("min_points").notNull(),
  pointsEarnRate: decimal("points_earn_rate", { precision: 5, scale: 2 }).notNull().default("1.0"), // Points per dollar
  discountPercent: decimal("discount_percent", { precision: 5, scale: 2 }).notNull().default("0"), // Discount percentage
});

export const insertMemberLevelSchema = createInsertSchema(memberLevels);
export type InsertMemberLevel = z.infer<typeof insertMemberLevelSchema>;
export type MemberLevel = typeof memberLevels.$inferSelect;

// Points transactions
export const pointsTransactions = mysqlTable("points_transactions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  memberId: varchar("member_id", { length: 36 }).notNull().references(() => members.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 20 }).notNull(), // "earn" | "spend" | "expire" | "adjust"
  amount: int("amount").notNull(),
  balance: int("balance").notNull(), // Points balance after transaction
  description: text("description"),
  referenceId: varchar("reference_id", { length: 36 }), // Reference to order/service/etc
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPointsTransactionSchema = createInsertSchema(pointsTransactions).pick({
  memberId: true,
  type: true,
  amount: true,
  description: true,
  referenceId: true,
});

export type InsertPointsTransaction = z.infer<typeof insertPointsTransactionSchema>;
export type PointsTransaction = typeof pointsTransactions.$inferSelect;

// Wallet transactions
export const walletTransactions = mysqlTable("wallet_transactions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  memberId: varchar("member_id", { length: 36 }).notNull().references(() => members.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 20 }).notNull(), // "topup" | "payment" | "refund" | "adjust"
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull(), // Wallet balance after transaction
  description: text("description"),
  referenceId: varchar("reference_id", { length: 36 }), // Reference to order/service/etc
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWalletTransactionSchema = createInsertSchema(walletTransactions).pick({
  memberId: true,
  type: true,
  amount: true,
  description: true,
  referenceId: true,
});

export type InsertWalletTransaction = z.infer<typeof insertWalletTransactionSchema>;
export type WalletTransaction = typeof walletTransactions.$inferSelect;

// Cart table
export const carts = mysqlTable("carts", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  memberId: varchar("member_id", { length: 36 }).notNull().references(() => members.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).notNull().default("active"), // "active" | "abandoned" | "completed"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCartSchema = createInsertSchema(carts).pick({
  memberId: true,
  status: true,
});

export type InsertCart = z.infer<typeof insertCartSchema>;
export type Cart = typeof carts.$inferSelect;

// Cart items (can be services, parts, etc.)
export const cartItems = mysqlTable("cart_items", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  cartId: varchar("cart_id", { length: 36 }).notNull().references(() => carts.id, { onDelete: "cascade" }),
  itemType: varchar("item_type", { length: 20 }).notNull(), // "service" | "part" | "product"
  itemId: varchar("item_id", { length: 36 }).notNull(), // Reference to service/part/product
  name: varchar("name", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: int("quantity").notNull().default(1),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  cartId: true,
  itemType: true,
  itemId: true,
  name: true,
  price: true,
  quantity: true,
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

// Reports table (for repair staff / owners to track issues)
export const reports = mysqlTable("reports", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  reporterId: varchar("reporter_id", { length: 36 }).notNull(),
  reporterType: mysqlEnum("reporter_type", ["member", "repair_staff", "user"]).notNull().default("repair_staff"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["open", "in_progress", "resolved"]).notNull().default("open"),
  assignedTo: varchar("assigned_to", { length: 36 }),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const insertReportSchema = createInsertSchema(reports).pick({
  reporterId: true,
  reporterType: true,
  title: true,
  description: true,
  metadata: true,
});

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;
