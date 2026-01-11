<template>
  <div class="app-shell">
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>

    <div class="page-container">
      <nav class="navbar">
        <div class="brand" @click="router.push('/')" style="cursor: pointer">
          <div class="logo-icon">S</div>
          <span class="brand-text">Student<span class="accent">Sys</span></span>
        </div>
      </nav>

      <main class="auth-content">
        <div class="glass-card auth-card">
          <div class="auth-header">
            <h2>Welcome Back</h2>
            <p class="auth-subtitle">Enter your credentials to access your dashboard</p>
          </div>

          <p v-if="error" class="error-badge">{{ error }}</p>

          <form @submit.prevent="handleLogin" class="premium-form">
            <div class="input-group">
              <label>Email Address</label>
              <input v-model="email" type="email" placeholder="name@university.edu" required />
            </div>

            <div class="input-group">
              <label>Password</label>
              <input v-model="password" type="password" placeholder="••••••••" required />
            </div>

            <div class="form-options">
              <div class="remember-me">
                <input type="checkbox" id="remember" />
                <label for="remember">Remember me</label>
              </div>
              <router-link to="/forgot-password" class="forgot-link">Forgot password?</router-link>
            </div>

            <button type="submit" class="auth-btn">Login to Dashboard</button>
          </form>

          <p class="footer-text">
            Don’t have an account?
            <router-link to="/register" class="accent-link">Create Account</router-link>
          </p>
        </div>
      </main>

      <footer class="footer">
        <div class="footer-top">
          <div class="footer-col">
            <div class="brand">
              <div class="logo-icon">S</div>
              <span class="brand-text">Student<span class="accent">Sys</span></span>
            </div>
            <p class="footer-desc">
              The next generation of educational administration.
              Built for speed, security, and simplicity.
            </p>
          </div>
          <div class="footer-nav">
            <div class="footer-col">
              <h4>Platform</h4>
              <div class="link-group">
                <a href="#">Overview</a>
                <a href="#">Features</a>
                <a href="#">Security</a>
              </div>
            </div>
            <div class="footer-col">
              <h4>Support</h4>
              <div class="link-group">
                <a href="#">Help Center</a>
                <a href="#">Documentation</a>
                <a href="#">Contact</a>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="copyright">© 2026 StudentSys Inc. All rights reserved.</p>
          <div class="social-links">
            <span>Twitter</span>
            <span>GitHub</span>
            <span>LinkedIn</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";

const router = useRouter();
const auth = useAuthStore();
const email = ref("");
const password = ref("");
const error = ref("");

const handleLogin = async () => {
  try {
    await auth.login(email.value, password.value);

    // auth store already has user & token
    if (auth.user?.role === "admin") {
      router.push("/admin");
    } else {
      if (auth.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/app");
      }

    }
  } catch (err: any) {
    error.value = err?.response?.data?.message || "Invalid credentials";
  }
};
</script>

<style>
/* Global Reset */
html,
body {
  margin: 0;
  padding: 0;
  background-color: #0f172a;
  overflow-x: hidden;
}
</style>

<style scoped>
/* Variables matched to your StudentList */
.app-shell {
  --primary: #6366f1;
  --accent: #f43f5e;
  --bg-app: #0f172a;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --glass: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.1);

  background-color: var(--bg-app);
  color: var(--text-main);
  min-height: 100vh;
  width: 100%;
  font-family: 'Inter', sans-serif;
  position: relative;
}

/* Background Blobs */
.bg-blob {
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(140px);
  z-index: 0;
  opacity: 0.2;
  pointer-events: none;
}

.blob-1 {
  background: var(--primary);
  top: -200px;
  right: -100px;
}

.blob-2 {
  background: var(--accent);
  bottom: -200px;
  left: -100px;
}

.page-container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  padding: 0.8rem 2.5rem;
  border-radius: 24px;
  border: 1px solid var(--glass-border);
  margin-bottom: 4rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: var(--primary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #fff;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
}

.brand-text {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
}

.brand-text .accent {
  color: var(--primary);
}

.navbar-buttons {
  display: flex;
  gap: 12px;
}

.nav-btn {
  padding: 0.7rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: 0.3s;
}

.btn-add {
  background: var(--primary);
  color: white;
}

.btn-view {
  background: transparent;
  color: white;
  border: 1px solid var(--glass-border);
}

.nav-btn.active {
  box-shadow: 0 0 15px var(--primary);
  background: var(--primary);
  border: none;
}

/* Auth Card Styling */
.auth-content {
  display: flex;
  justify-content: center;
  padding: 2rem 0 6rem 0;
}

.auth-card {
  background: var(--glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 32px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.auth-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.auth-header h2 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.error-badge {
  background: rgba(244, 63, 94, 0.1);
  color: #fb7185;
  padding: 0.8rem;
  border-radius: 12px;
  border: 1px solid rgba(244, 63, 94, 0.2);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
}

.premium-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.input-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-left: 4px;
}

.input-group input {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--glass-border);
  padding: 1rem 1.2rem;
  border-radius: 14px;
  color: white;
  outline: none;
  transition: 0.3s;
}

.input-group input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  background: rgba(15, 23, 42, 0.8);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
}

.forgot-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
}

.auth-btn {
  background: linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 1rem;
}

.auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
  filter: brightness(1.1);
}

.footer-text {
  text-align: center;
  margin-top: 2rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.accent-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 700;
  margin-left: 5px;
}

/* Footer */
.footer {
  margin-top: 40px;
  padding: 40px;
  background: var(--glass);
  border-radius: 40px 40px 0 0;
  border-top: 1px solid var(--glass-border);
}

.footer-top {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.footer-desc {
  color: var(--text-muted);
  margin-top: 1rem;
  font-size: 0.9rem;
}

.footer-nav {
  display: flex;
  gap: 60px;
}

.footer-col h4 {
  color: #fff;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
}

.link-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.link-group a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
}

.footer-bottom {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
}

.social-links {
  display: flex;
  gap: 20px;
  color: var(--text-muted);
  font-size: 0.8rem;
}
</style>