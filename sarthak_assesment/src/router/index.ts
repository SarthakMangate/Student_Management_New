import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import Landing from "../views/Landing.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import StudentList from "../views/StudentList.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";
import AdminDashboard from "../views/AdminDashboard.vue";
import { useAuthStore } from "../store/auth";

const routes: Array<RouteRecordRaw> = [
  { path: "/", component: Landing },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/forgot-password", component: ForgotPassword },
  { path: "/reset-password", component: ResetPassword },
  {
    path: "/app",
    component: StudentList,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    component: AdminDashboard,
    meta: { requiresAuth: true, adminOnly: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  if (to.meta.adminOnly && user.role !== "admin") {
    return next("/app");
  }

  next();
});

export default router;
