import { useState } from "react";
import type { ReactNode } from "react";
import { loginRequest } from "../api/authApi";
import { findUserByDummyId, createUserProfile } from "../api/userApi";
import type { UserProfile } from "../types/user";
import { AuthContext } from "./AuthContext";

function getInitialUser(): UserProfile | null {
  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
}

function getInitialToken(): string | null {
  return localStorage.getItem("token");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(getInitialUser);
  const [token, setToken] = useState<string | null>(getInitialToken);
  const [error, setError] = useState<string | null>(null);

  async function login(username: string, password: string) {
    setError(null);
    try {
      const dummyUser = await loginRequest({ username, password });

      let profile = await findUserByDummyId(dummyUser.id);
      if (!profile) {
        profile = await createUserProfile({
          dummyJsonId: dummyUser.id,
          username: dummyUser.username,
          email: dummyUser.email,
          firstName: dummyUser.firstName,
          lastName: dummyUser.lastName,
          avatar: dummyUser.image,
        });
      }

      setToken(dummyUser.accessToken);
      setUser(profile);
      localStorage.setItem("token", dummyUser.accessToken);
      localStorage.setItem("user", JSON.stringify(profile));
    } catch (err) {
      setError("Неверный логин или пароль");
      throw err;
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading: false,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}