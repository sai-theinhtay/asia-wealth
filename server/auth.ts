import bcrypt from "bcryptjs";
import { storage } from "./storage";
import type { Member, User } from "@shared/schema";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function authenticateMember(email: string, password: string): Promise<Member | null> {
  const member = await storage.getMemberByEmail(email);
  if (!member) return null;
  
  const isValid = await comparePassword(password, member.password);
  if (!isValid) return null;
  
  return member;
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const user = await storage.getUserByUsername(username);
  if (!user) return null;
  
  const isValid = await comparePassword(password, user.password);
  if (!isValid) return null;
  
  return user;
}

