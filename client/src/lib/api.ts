// API client functions for React Query

export const api = {
  // Auth - Members
  memberLogin: async (email: string, password: string) => {
    const res = await fetch("/api/auth/member/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },

  memberRegister: async (data: { name: string; email: string; phone: string; password: string }) => {
    const res = await fetch("/api/auth/member/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Registration failed");
    return res.json();
  },

  memberLogout: async () => {
    const res = await fetch("/api/auth/member/logout", {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Logout failed");
    return res.json();
  },

  getMemberMe: async () => {
    const res = await fetch("/api/auth/member/me", {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Not authenticated");
    return res.json();
  },

  // Auth - Admin
  adminLogin: async (username: string, password: string) => {
    const res = await fetch("/api/auth/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },

  adminLogout: async () => {
    const res = await fetch("/api/auth/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Logout failed");
    return res.json();
  },

  getAdminMe: async () => {
    const res = await fetch("/api/auth/admin/me", {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Not authenticated");
    return res.json();
  },

  // Members
  // Members
  getMembers: async () => {
    const res = await fetch("/api/members");
    if (!res.ok) throw new Error("Failed to fetch members");
    return res.json();
  },

  getMember: async (id: string) => {
    const res = await fetch(`/api/members/${id}`);
    if (!res.ok) throw new Error("Failed to fetch member");
    return res.json();
  },

  createMember: async (data: any) => {
    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create member");
    return res.json();
  },

  updateMember: async (id: string, data: any) => {
    const res = await fetch(`/api/members/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update member");
    return res.json();
  },

  deleteMember: async (id: string) => {
    const res = await fetch(`/api/members/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete member");
  },

  // Points
  addPoints: async (memberId: string, amount: number, description?: string, referenceId?: string) => {
    const res = await fetch(`/api/members/${memberId}/points/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, description, referenceId }),
    });
    if (!res.ok) throw new Error("Failed to add points");
    return res.json();
  },

  spendPoints: async (memberId: string, amount: number, description?: string, referenceId?: string) => {
    const res = await fetch(`/api/members/${memberId}/points/spend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, description, referenceId }),
    });
    if (!res.ok) throw new Error("Failed to spend points");
    return res.json();
  },

  getPointsTransactions: async (memberId: string, limit = 50) => {
    const res = await fetch(`/api/members/${memberId}/points/transactions?limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch points transactions");
    return res.json();
  },

  // Wallet
  topUpWallet: async (memberId: string, amount: number, description?: string) => {
    const res = await fetch(`/api/members/${memberId}/wallet/topup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, description }),
    });
    if (!res.ok) throw new Error("Failed to top up wallet");
    return res.json();
  },

  deductWallet: async (memberId: string, amount: number, description?: string, referenceId?: string) => {
    const res = await fetch(`/api/members/${memberId}/wallet/deduct`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, description, referenceId }),
    });
    if (!res.ok) throw new Error("Failed to deduct wallet");
    return res.json();
  },

  getWalletTransactions: async (memberId: string, limit = 50) => {
    const res = await fetch(`/api/members/${memberId}/wallet/transactions?limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch wallet transactions");
    return res.json();
  },

  // Cart
  getCart: async (memberId: string) => {
    const res = await fetch(`/api/members/${memberId}/cart`);
    if (!res.ok) throw new Error("Failed to fetch cart");
    return res.json();
  },

  addCartItem: async (cartId: string, item: any) => {
    const res = await fetch(`/api/carts/${cartId}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error("Failed to add cart item");
    return res.json();
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    const res = await fetch(`/api/cart-items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) throw new Error("Failed to update cart item");
    return res.json();
  },

  removeCartItem: async (itemId: string) => {
    const res = await fetch(`/api/cart-items/${itemId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to remove cart item");
  },

  clearCart: async (cartId: string) => {
    const res = await fetch(`/api/carts/${cartId}/clear`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to clear cart");
  },

  completeCart: async (cartId: string) => {
    const res = await fetch(`/api/carts/${cartId}/complete`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to complete cart");
    return res.json();
  },
};

