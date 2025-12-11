import { useQuery } from "@tanstack/react-query";

export type AuthInfo = {
  userType: string | null;
  user: any | null;
};

export function useAuth() {
  return useQuery<AuthInfo | null>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 60_000,
  });
}
