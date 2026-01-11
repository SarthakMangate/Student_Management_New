<template>
  <div class="auth-page">
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>

    <div class="glass-card">
      <div class="header">
        <div class="icon-box">🔑</div>
        <h2>Forgot Password</h2>
        <p class="subtitle">Enter your email and we'll send you a link to reset your password.</p>
      </div>

      <transition name="fade">
        <div v-if="message" class="alert-success">
          <span class="check-icon">✓</span> {{ message }}
        </div>
      </transition>

      <form @submit.prevent="submit" class="auth-form">
        <div class="input-group">
          <label>Email Address</label>
          <input v-model="email" type="email" placeholder="name@example.com" required />
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>

        <router-link to="/login" class="back-link">
          ← Back to Login
        </router-link>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import api from "../utils/api";
const router = useRouter();

const email = ref("");
const message = ref("");
const loading = ref(false);

const submit = async () => {
  try {
    const res = await api.post("/password/forgot-password", {
      email: email.value,
    });

    const token = res.data.resetToken;

    // Store token temporarily
    localStorage.setItem("resetToken", token);

    // Redirect user to reset page
    router.push("/reset-password");
  } catch (err: any) {
    alert(err.response?.data?.message || "Error sending reset link");
  }
};
</script>

<style scoped>
.auth-page {
  --primary: #6366f1;
  --accent: #f43f5e;
  --bg-dark: #0f172a;
  background-color: var(--bg-dark);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  position: relative;
}

/* Background Blobs */
.bg-blob {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  filter: blur(120px);
  z-index: 0;
  opacity: 0.15;
  pointer-events: none;
}

.blob-1 {
  background: var(--primary);
  top: -100px;
  right: -100px;
}

.blob-2 {
  background: var(--accent);
  bottom: -100px;
  left: -100px;
}

/* Glass Card - High Border Radius */
.glass-card {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 40px;
  /* High Radius */
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.icon-box {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

h2 {
  color: #fff;
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Form Styling */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 1px;
}

input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  /* High Radius */
  padding: 14px 18px;
  color: #fff;
  font-size: 1rem;
  transition: 0.3s;
}

input:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.btn-submit {
  background: var(--primary);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 18px;
  /* High Radius */
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
}

.btn-submit:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert-success {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #10b981;
  padding: 1rem;
  border-radius: 16px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1.5rem;
}

.back-link {
  text-align: center;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: 0.3s;
}

.back-link:hover {
  color: #fff;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>