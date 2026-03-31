import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/services/authService";
import { getToken } from "@/services/api";
import { User } from "@/types/auth";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    getUserInfo()
      .then((userData) => {
        setUser(userData);
        setIsAuthLoading(false);
      })
      .catch(() => {
        // Token invalid atau expired
        router.replace("/login");
      });
  }, [router]);

  return { user, isAuthLoading };
}
