<template>
  <div class="auth-page">
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>

    <div class="glass-card">
      <div class="header">
        <div class="icon-box">🛡️</div>
        <h2>Reset Password</h2>
        <p class="subtitle">Secure your account by entering your reset token and choosing a new password.</p>
      </div>

      <transition name="shake">
        <div v-if="error" class="alert-error">
          <span class="warn-icon">⚠️</span> {{ error }}
        </div>
      </transition>

      <form @submit.prevent="submit" class="auth-form">
        <div class="input-group">
          <label>Reset Token</label>
          <input v-model="token" type="text" placeholder="Paste your token here" required />
        </div>

        <div class="input-group">
          <label>New Password</label>
          <input v-model="password" type="password" placeholder="••••••••" required />
        </div>

        <button type="submit" class="btn-reset" :disabled="loading">
          {{ loading ? 'Updating...' : 'Update Password' }}
        </button>

        <router-link to="/" class="back-link">
          Cancel and return to login
        </router-link>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import api from "../utils/api";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const router = useRouter();
const token = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

onMounted(() => {
  token.value = localStorage.getItem("resetToken") || "";
});

const submit = async () => {
  loading.value = true;
  error.value = "";
  try {
    await api.post("/password/reset-password", {
      token: token.value,
      newPassword: password.value,
    });
    router.push("/login");
  } catch (err) {
    error.value = "Invalid or expired token. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-page {
  --primary: #6366f1;
  --accent: #f43f5e;
  --bg-dark: #090e1a;
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
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(140px);
  z-index: 0;
  opacity: 0.12;
  pointer-events: none;
}

.blob-1 {
  background: var(--primary);
  top: -150px;
  left: -100px;
}

.blob-2 {
  background: var(--accent);
  bottom: -150px;
  right: -100px;
}

/* Glass Card */
.glass-card {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 40px;
  /* High Radius */
  padding: 3.5rem 3rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
}

.header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.icon-box {
  font-size: 3rem;
  margin-bottom: 1rem;
}

h2 {
  color: #fff;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 0.75rem;
}

.subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Form Layout */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.input-group label {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 800;
  color: #475569;
  letter-spacing: 1.2px;
  padding-left: 4px;
}

input {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  /* High Radius */
  padding: 16px 20px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.07);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
}

.btn-reset {
  background: #fff;
  /* High contrast button */
  color: #000;
  border: none;
  padding: 18px;
  border-radius: 20px;
  /* High Radius */
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin-top: 0.5rem;
}

.btn-reset:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 15px 30px rgba(255, 255, 255, 0.1);
}

.btn-reset:disabled {
  opacity: 0.5;
  transform: none;
}

/* Alert Styling */
.alert-error {
  background: rgba(244, 63, 94, 0.1);
  border: 1px solid rgba(244, 63, 94, 0.2);
  color: #fb7185;
  padding: 1rem 1.25rem;
  border-radius: 18px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.5rem;
}

.back-link {
  text-align: center;
  color: #64748b;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: 0.3s;
}

.back-link:hover {
  color: var(--primary);
}

/* Shake Animation for Errors */
.shake-enter-active {
  animation: shake 0.4s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes shake {

  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>