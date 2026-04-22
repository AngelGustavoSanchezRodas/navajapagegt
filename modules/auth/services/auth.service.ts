const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/auth";

class AuthService {
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Error al iniciar sesión");
    }

    if (typeof window !== "undefined" && data?.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  }

  async register(nombre: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Error al registrar usuario");
    }

    return data;
  }

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  getToken() {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem("token");
  }

  isAuthenticated() {
    if (typeof window === "undefined") {
      return false;
    }

    return !!localStorage.getItem("token");
  }
}

export const authService = new AuthService();
