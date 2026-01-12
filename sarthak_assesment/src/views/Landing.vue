<template>
  <div class="app-shell">
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>

    <div class="page-container">
      <nav class="navbar">
        <div class="brand">
          <div class="logo-icon">S</div>
          <span class="brand-text">Student<span class="accent">Sys</span></span>
        </div>

        <div class="navbar-buttons">
          <button class="nav-btn btn-view" @click="router.push('/login')">Log In</button>
          <button class="nav-btn btn-add active" @click="router.push('/register')">Sign Up</button>
        </div>
      </nav>

      <header class="hero-section">
        <div class="hero-text">
          <div class="badge-premium">Enrollment Open</div>

          <h1 class="title">
            Manage your <br />
            <span class="gradient-text">Academic Universe</span>
          </h1>
          <p class="subtitle">
            A high-performance student management interface designed with
            glassmorphism aesthetics and seamless workflow integration.
          </p>

          <div class="hero-actions">
            <button class="hero-cta" @click="router.push('/login')">
              Get Started Now
            </button>
            <div class="hero-stats">
              <div class="stat">
                <span class="stat-value">Daily</span>
                <span class="stat-label">Auto Backups</span>

              </div>
              <div class="divider"></div>
              <div class="stat">
                <span class="stat-value">24/7</span>
                <span class="stat-label">System Monitoring</span>

              </div>
            </div>
          </div>
        </div>
      </header>

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
  <div>
    <PublicHelpChatbot />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import PublicHelpChatbot from "../components/PublicHelpChatbot.vue";
const router = useRouter();
</script>

<style>
/* CRITICAL: Global Reset to remove white margins */
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #0f172a;
  /* Same as var(--bg-app) */
  overflow-x: hidden;
}
</style>

<style scoped>
/* ===== Variables & Core ===== */
.app-shell {
  --primary: #6366f1;
  --accent: #f43f5e;
  --bg-app: #0f172a;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --glass: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.1);
  --shadow-premium: 0 20px 50px rgba(0, 0, 0, 0.4);

  background-color: var(--bg-app);
  color: var(--text-main);
  min-height: 100vh;
  width: 100%;
  font-family: 'Inter', sans-serif;
  position: relative;
}

/* Atmospheric Background */
.bg-blob {
  position: fixed;
  width: 700px;
  height: 700px;
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

/* ===== Navbar ===== */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  padding: 0.8rem 2.5rem;
  border-radius: 24px;
  border: 1px solid var(--glass-border);
  margin-bottom: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
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
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

.nav-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.nav-btn.active {
  box-shadow: 0 0 15px var(--primary);
}

/* ===== Hero Section ===== */
.hero-section {
  padding: 6rem 4rem;
  background: var(--glass);
  border-radius: 40px;
  border: 1px solid var(--glass-border);
  margin-bottom: 4rem;
  backdrop-filter: blur(5px);
}

.badge-premium {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  letter-spacing: 1px;
}

.hero-text .title {
  font-size: 3.8rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(90deg, #818cf8, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--text-muted);
  font-size: 1.25rem;
  max-width: 550px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 3rem;
  margin-top: 3.5rem;
}

.hero-cta {
  padding: 1.2rem 3rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%);
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: 0.4s;
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
}

.hero-cta:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(99, 102, 241, 0.5);
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.divider {
  width: 1px;
  height: 35px;
  background: var(--glass-border);
}

/* ===== Footer ===== */
.footer {
  margin-top: 60px;
  padding: 60px 40px 30px;
  background: var(--glass);
  backdrop-filter: blur(12px);
  border-radius: 40px 40px 0 0;
  border-top: 1px solid var(--glass-border);
}

.footer-top {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 40px;
}

.footer-desc {
  color: var(--text-muted);
  margin-top: 1.2rem;
  max-width: 280px;
  line-height: 1.5;
  font-size: 0.95rem;
}

.footer-nav {
  display: flex;
  gap: 80px;
}

.footer-col h4 {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 24px;
  text-transform: uppercase;
}

.link-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link-group a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  transition: 0.3s;
}

.link-group a:hover {
  color: var(--primary);
  transform: translateX(5px);
}

.footer-bottom {
  margin-top: 50px;
  padding-top: 25px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.social-links {
  display: flex;
  gap: 20px;
}

.social-links span {
  font-size: 0.85rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: 0.3s;
}

.social-links span:hover {
  color: #fff;
}

/* Responsive */
@media (max-width: 992px) {
  .hero-section {
    padding: 4rem 2rem;
  }

  .hero-text .title {
    font-size: 3rem;
  }

  .footer-nav {
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0.8rem 1.5rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 2.5rem;
  }

  .footer-top {
    flex-direction: column;
  }
}
</style>