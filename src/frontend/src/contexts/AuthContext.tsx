import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "staff";
  avatar?: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

type AuthContextType = AuthState & {
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_CREDENTIALS = {
  email: "admin@escola.com",
  password: "password123",
};

const DEMO_USER: User = {
  id: "usr-001",
  name: "Dr. Sarah Evans",
  email: "admin@escola.com",
  role: "admin",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Restore session from localStorage
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userStr = localStorage.getItem("user");
    if (accessToken && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        setState({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        setState((s) => ({ ...s, isLoading: false }));
      }
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  // Listen for force-logout events from API client
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener("escola:logout", handler);
    return () => window.removeEventListener("escola:logout", handler);
  });

  const login = useCallback(async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    if (
      email === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      const accessToken = `mock-access-token-${Date.now()}`;
      const refreshToken = `mock-refresh-token-${Date.now()}`;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(DEMO_USER));
      setState({
        user: DEMO_USER,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    }
    return {
      success: false,
      error: "Invalid email or password. Try admin@escola.com / password123",
    };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;
    // Mock refresh
    const newToken = `mock-access-token-${Date.now()}`;
    localStorage.setItem("accessToken", newToken);
    setState((s) => ({ ...s, accessToken: newToken }));
    return true;
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
