"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../lib/constants/urls";
import { getSession } from "../server/actions/sessions";

interface User {
  id: string;
  kindeId: string;
  name: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getSession();
        const response = await axios.get(`${BACKEND_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        });
        setUser(response.data);
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
