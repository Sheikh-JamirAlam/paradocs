import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../lib/constants/urls";

interface User {
  id: string;
  kindeId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/auth/me`, {
          withCredentials: true,
        });

        setUser(response.data.user);
      } catch (err) {
        const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to fetch user data";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading, error };
}
