<template>
  <div class="app-shell">
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>
    <div class="bg-blob blob-3"></div>

    <div class="page-container">
      <nav class="navbar">
        <div class="brand">
          <div class="logo-icon">S</div>
          <span class="brand-text">Student<span class="accent">Sys</span></span>
        </div>

        <div class="navbar-actions">
          <button class="nav-btn btn-add" @click="openAdd">
            <span class="plus-icon">+</span> New Student
          </button>
          <button v-if="isAdmin" class="nav-btn" @click="$router.push('/admin')">
            Admin Panel
          </button>

          <button class="nav-btn btn-logout" @click="showLogoutConfirm = true">
            Logout
          </button>
        </div>
      </nav>

      <header class="header-section">
        <h1 class="title">Student <span class="gradient-text">Directory</span></h1>
        <p class="subtitle">Managing {{ students.length }} academic records with precision.</p>
      </header>

      <main class="card-grid">
        <div v-for="s in students" :key="s.id" class="glass-card student-item">
          <div class="card-header">
            <div class="avatar-glow">
              <img v-if="s.image" :src="`${apiUrl}${s.image}`" class="card-photo" />
              <div v-else class="initials-box-large">{{ s.name.charAt(0) }}</div>
            </div>
            <div class="pill-badge">{{ s.course || 'Unassigned' }}</div>
          </div>

          <div class="card-body">
            <h3 class="card-name">{{ s.name }}</h3>
            <p class="card-email">{{ s.email }}</p>
          </div>

          <div class="card-actions">
            <button class="action-btn view" @click="viewDetails(s)">
              👁️ View Profile
            </button>

            <template v-if="s.created_by === auth.userId">
              <button class="action-btn edit" @click="edit(s)" title="Edit">✏️</button>
              <button class="action-btn delete" @click="confirmDelete(s)" title="Delete">🗑️</button>
            </template>
          </div>
        </div>
      </main>

      <div v-if="students.length === 0" class="empty-state">
        <div class="empty-icon">📁</div>
        <h3>No Records Found</h3>
      </div>

      <StudentModal v-if="show" :student="selected" @save="save" @close="show = false" />

      <div v-if="showDetails" class="modal-overlay" @click.self="showDetails = false">
        <div class="glass-modal-card profile-detail-modal">
          <button class="close-btn" @click="showDetails = false">&times;</button>

          <div v-if="selectedDetail" class="profile-container">
            <div class="profile-header-cover">
              <div class="profile-main-avatar">
                <img v-if="selectedDetail.image" :src="`${apiUrl}${selectedDetail.image}`" />
                <div v-else class="big-initials-modal">{{ selectedDetail.name.charAt(0) }}</div>
              </div>
            </div>

            <div class="profile-content">
              <div class="profile-intro">
                <h2 class="profile-name">{{ selectedDetail.name }}</h2>
                <p class="profile-course">{{ selectedDetail.course }}</p>
                <div class="meta-pills">
                  <span class="id-tag">UID: {{ selectedDetail.id }}</span>
                  <span class="date-tag">Added: {{ new Date(selectedDetail.created_at).toLocaleDateString() }}</span>
                </div>
              </div>

              <div class="profile-info-grid">
                <div class="info-item">
                  <label>Email Address</label>
                  <p>{{ selectedDetail.email || 'Not Provided' }}</p>
                </div>
                <div class="info-item">
                  <label>Phone Number</label>
                  <p>{{ selectedDetail.phone || 'Not Provided' }}</p>
                </div>
                <div class="info-item">
                  <label>Age</label>
                  <p>{{ selectedDetail.age ? selectedDetail.age + ' Years' : 'N/A' }}</p>
                </div>
                <div class="info-item">
                  <label>Gender</label>
                  <p>{{ selectedDetail.gender || 'Not Specified' }}</p>
                </div>
                <div class="info-item full">
                  <label>Residential Address</label>
                  <p class="address-text">{{ selectedDetail.address || 'No address record found.' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showLogoutConfirm" class="modal-overlay" @click.self="showLogoutConfirm = false">
        <div class="glass-modal-card confirm-popup">
          <div class="warn-icon">🔑</div>
          <h2>End Session?</h2>
          <p>Are you sure you want to logout?</p>
          <div class="confirm-actions">
            <button class="btn-secondary" @click="showLogoutConfirm = false">Cancel</button>
            <button class="btn-primary" @click="handleLogout">Logout</button>
          </div>
        </div>
      </div>

      <div v-if="studentToDelete" class="modal-overlay" @click.self="studentToDelete = null">
        <div class="glass-modal-card confirm-popup">
          <div class="warn-icon danger-icon">🗑️</div>
          <h2>Delete Student?</h2>
          <p>This will permanently remove <strong>{{ studentToDelete.name }}</strong> from the database. This action
            cannot be
            undone.</p>
          <div class="confirm-actions">
            <button class="btn-secondary" @click="studentToDelete = null">Cancel</button>
            <button class="btn-danger" @click="executeDelete">Confirm Delete</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../utils/api";
import { useAuthStore } from "../store/auth";
import StudentModal from "../components/StudentModal.vue";
const user = JSON.parse(localStorage.getItem("user") || "{}");
const isAdmin = user.role === "admin";


const auth = useAuthStore();
const router = useRouter();
const apiUrl = import.meta.env.VITE_API_URL;

const students = ref<any[]>([]);
const show = ref(false);
const showDetails = ref(false);
const showLogoutConfirm = ref(false);
const studentToDelete = ref<any>(null); // For custom delete confirm
const selected = ref<any>(null);
const selectedDetail = ref<any>(null);

const load = async () => {
  try {
    const res = await api.get("/students");
    students.value = res.data;
  } catch (err) { console.error(err); }
};

const handleLogout = async () => {
  await auth.logout();
  router.push("/");
};

const openAdd = () => {
  selected.value = null;
  show.value = true;
};

const edit = (s: any) => {
  selected.value = s;
  show.value = true;
};

const viewDetails = (s: any) => {
  selectedDetail.value = s;
  showDetails.value = true;
};

const confirmDelete = (s: any) => {
  studentToDelete.value = s;
};

const executeDelete = async () => {
  if (!studentToDelete.value) return;
  try {
    await api.delete(`/students/${studentToDelete.value.id}`);
    studentToDelete.value = null;
    load();
  } catch (err) { console.error(err); }
};

const save = async (fd: FormData) => {
  try {
    if (selected.value) {
      await api.put(`/students/${selected.value.id}`, fd);
    } else {
      await api.post("/students", fd);
    }
    show.value = false;
    load();
  } catch (err) { console.error(err); }
};

onMounted(load);
</script>

<style scoped>
/* Core Theme */
.app-shell {
  --primary: #6366f1;
  --accent: #f43f5e;
  --bg-dark: #0f172a;
  --text-main: #f8fafc;
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);
  background-color: var(--bg-dark);
  color: var(--text-main);
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

.bg-blob {
  position: fixed;
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
  top: -200px;
  right: -100px;
}

.blob-2 {
  background: var(--accent);
  bottom: -200px;
  left: -100px;
}

.blob-3 {
  background: #10b981;
  top: 30%;
  left: 40%;
  width: 300px;
  opacity: 0.05;
}

.page-container {
  position: relative;
  z-index: 1;
  max-width: 1240px;
  margin: 0 auto;
  padding: 2rem;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  padding: 1rem 2.5rem;
  border-radius: 24px;
  border: 1px solid var(--glass-border);
  margin-bottom: 3.5rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: var(--primary);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #fff;
}

.brand-text {
  font-size: 1.3rem;
  font-weight: 700;
}

.nav-btn {
  padding: 0.7rem 1.4rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  border: none;
}

.btn-add {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 10px 20px -10px var(--primary);
}

.btn-logout {
  background: transparent;
  color: var(--accent);
  border: 1px solid rgba(244, 63, 94, 0.2);
  margin-left: 10px;
}

/* Header */
.title {
  font-size: 3rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -1.5px;
}

.gradient-text {
  background: linear-gradient(90deg, #818cf8, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #94a3b8;
  font-size: 1.1rem;
  margin-top: 10px;
}

/* Student Card */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(14px);
  border: 1px solid var(--glass-border);
  border-radius: 32px;
  padding: 2rem;
  transition: all 0.4s ease;
  text-align: center;
}

.glass-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.07);
}

.avatar-glow {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  padding: 5px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  margin: 0 auto 1.5rem;
}

.card-photo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--bg-dark);
}

.initials-box-large {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #1e293b;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 800;
  border: 3px solid var(--bg-dark);
}

.pill-badge {
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  margin-top: -10px;
}

.card-name {
  font-size: 1.4rem;
  margin: 1rem 0 0.3rem;
  font-weight: 700;
}

.card-email {
  color: #64748b;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  height: 44px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

.action-btn.view {
  background: var(--text-main);
  color: var(--bg-dark);
  font-weight: 700;
  flex: 1;
}

.action-btn.edit {
  background: rgba(255, 255, 255, 0.05);
  color: white;
  width: 44px;
}

.action-btn.delete {
  background: rgba(244, 63, 94, 0.1);
  color: #fb7185;
  width: 44px;
}

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.glass-modal-card {
  background: #0f172a;
  border: 1px solid var(--glass-border);
  border-radius: 40px;
  position: relative;
}

/* Detail Modal Upgrades */
.profile-detail-modal {
  max-width: 750px;
  width: 100%;
  overflow: hidden;
}

.profile-header-cover {
  height: 160px;
  background: linear-gradient(135deg, #312e81, #581c87);
  position: relative;
  margin-bottom: 60px;
}

.profile-main-avatar {
  position: absolute;
  bottom: -50px;
  left: 40px;
  width: 130px;
  height: 130px;
  border-radius: 35px;
  border: 6px solid #0f172a;
  overflow: hidden;
  background: #1e293b;
}

.profile-main-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-content {
  padding: 0 40px 40px;
}

.profile-name {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
}

.profile-course {
  color: var(--primary);
  font-weight: 700;
  font-size: 1.2rem;
  margin-top: 5px;
}

.meta-pills {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.meta-pills span {
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 6px 12px;
  border-radius: 10px;
  color: #94a3b8;
  border: 1px solid var(--glass-border);
}

.profile-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 2.5rem;
  border-top: 1px solid var(--glass-border);
  padding-top: 2rem;
}

.info-item label {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.info-item p {
  font-size: 1.05rem;
  color: #f1f5f9;
  margin: 0;
}

.info-item.full {
  grid-column: span 2;
}

.address-text {
  line-height: 1.6;
  color: #cbd5e1;
}

/* Confirm Popups (Logout & Delete) */
.confirm-popup {
  max-width: 420px;
  padding: 3rem;
  text-align: center;
}

.warn-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.danger-icon {
  color: var(--accent);
}

.confirm-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
}

.confirm-actions button {
  flex: 1;
  padding: 14px;
  border-radius: 16px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: 0.3s;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-danger {
  background: var(--accent);
  color: white;
}

.btn-danger:hover {
  box-shadow: 0 0 20px rgba(244, 63, 94, 0.4);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 25px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  transition: 0.3s;
}

.close-btn:hover {
  background: var(--accent);
}

@media (max-width: 700px) {
  .profile-info-grid {
    grid-template-columns: 1fr;
  }

  .profile-main-avatar {
    left: 50%;
    transform: translateX(-50%);
  }

  .profile-intro {
    text-align: center;
    padding-top: 10px;
  }

  .meta-pills {
    justify-content: center;
  }
}
</style>