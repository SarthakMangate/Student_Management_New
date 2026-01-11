import { defineStore } from "pinia";
import api from "../utils/api";

interface User {
  id: number;
  email: string;
  role?: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") as string | null,
    user: JSON.parse(localStorage.getItem("user") || "null") as User | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === "admin",
    userId: (state) => state.user?.id,
  },

  actions: {
    async login(email: string, password: string) {
      const res = await api.post("/auth/login", { email, password });

      this.token = res.data.token;
      this.user = res.data.user;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.clear();
    },
  },
});
