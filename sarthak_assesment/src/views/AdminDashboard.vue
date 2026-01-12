<template>
  <div class="admin-shell">
    <div class="glow-overlay"></div>

    <aside class="sidebar">
      <div class="brand">
        <div class="logo-circle">S</div>
        <div class="brand-info">
          <span class="brand-name">Student<span class="accent">Sys</span></span>
        </div>
      </div>

      <nav class="side-nav">
        <div class="nav-section">
          <span class="nav-label">Core Management</span>
          <a href="#" class="nav-item" :class="{ active: currentView === 'dashboard' }" @click.prevent="currentView = 'dashboard'">
            <i class="icon">📊</i> Dashboard
          </a>
          <a href="#" class="nav-item" :class="{ active: currentView === 'records' }" @click.prevent="currentView = 'records'">
            <i class="icon">📁</i> All Records
          </a>
          <a href="#" class="nav-item"><i class="icon">⚙️</i> Settings</a>
        </div>
      </nav>

      <div class="sidebar-user-card">
        <div class="user-avatar">AD</div>
        <div class="user-meta">
          <p class="u-name">Root Admin</p>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <header class="navbar">
        <div class="nav-left">
          <h1 class="nav-title">
            {{ currentView === 'dashboard' ? 'System Overview' : 'All Student Records' }}
          </h1>
        </div>
        <div class="nav-right">
          <button class="nav-logout-btn" @click="showLogoutConfirm = true">
            <span class="logout-icon">🚪</span> Sign Out
          </button>
        </div>
      </header>

      <div class="content-body">
        <Transition name="fade" mode="out-in">
          <section v-if="currentView === 'dashboard'" class="dashboard-grid">
            <div class="stat-glass-card hero-card">
              <div class="stat-icon students-bg">🎓</div>
              <div class="stat-data">
                <span class="label">Total Students</span>
                <h2 class="value">{{ students.length }}</h2>
              </div>
            </div>

            <div class="graph-card">
              <h3 class="card-title">Branch Distribution</h3>
              <div class="distribution-list">
                <div v-for="(count, branch) in branchDistribution" :key="branch" class="graph-row">
                  <div class="graph-label">
                    <span class="branch-name">{{ branch }}</span>
                    <span class="branch-count">{{ count }}</span>
                  </div>
                  <div class="progress-container">
                    <div class="progress-bar" :style="{ width: getPercentage(count) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Transition>

        <section class="table-container" :class="{ 'records-view-active': currentView === 'records' }">
          <div class="table-header">
            <h3>{{ currentView === 'records' ? 'Detailed Directory' : 'Master Directory' }}</h3>
            <div class="table-actions">
              <input v-model="searchQuery" type="text" placeholder="Search students..." class="table-search" />
            </div>
          </div>

          <div class="glass-table-wrapper">
            <table class="modern-table">
              <thead>
                <tr>
                  <th>Identity</th>
                  <th>Branch</th>
                  <th>Database Owner</th>
                  <th class="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in filteredStudents" :key="s.id" class="table-row">
                  <td>
                    <div class="student-info">
                      <div class="initial-circle">{{ s.name.charAt(0) }}</div>
                      <span>{{ s.name }}</span>
                    </div>
                  </td>
                  <td><span class="course-pill">{{ s.course || 'General' }}</span></td>
                  <td><span class="owner-tag">👤 {{ s.owner_name }}</span></td>
                  <td class="text-right">
                    <button class="btn-view-action" @click="openModal(s)">View Profile</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="filteredStudents.length === 0" class="empty-placeholder">No records found.</div>
          </div>
        </section>
      </div>
    </main>

    <Transition name="fade">
      <div v-if="showLogoutConfirm" class="modal-overlay confirm-overlay" @click.self="showLogoutConfirm = false">
        <div class="confirm-card">
          <div class="confirm-icon">⚠️</div>
          <h3>Confirm Sign Out</h3>
          <p>Are you sure you want to terminate your current session?</p>
          <div class="confirm-actions">
            <button class="btn-cancel" @click="showLogoutConfirm = false">Stay Logged In</button>
            <button class="btn-confirm-logout" @click="handleLogout">Sign Out</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="slide-up">
      <div v-if="selectedStudent" class="modal-overlay" @click.self="closeModal">
        <div class="profile-card">
          <div class="card-gradient-header">
            <button class="close-card" @click="closeModal">✕</button>
            <div class="profile-avatar-wrapper">
              <div class="profile-avatar">{{ selectedStudent.name.charAt(0) }}</div>
            </div>
            <h2 class="profile-name">{{ selectedStudent.name }}</h2>
            <p class="profile-course">{{ selectedStudent.course || 'Unassigned' }}</p>
          </div>

          <div class="profile-content">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Age</span>
                <span class="info-value">{{ selectedStudent.age || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Gender</span>
                <span class="info-value">{{ selectedStudent.gender || 'N/A' }}</span>
              </div>
              <div class="info-item full">
                <span class="info-label">Email Address</span>
                <span class="info-value">{{ selectedStudent.email || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Phone</span>
                <span class="info-value">{{ selectedStudent.phone || 'N/A' }}</span>
              </div>
              <div class="info-item full">
                <span class="info-label">Residential Address</span>
                <span class="info-value">{{ selectedStudent.address || 'N/A' }}</span>
              </div>
            </div>
          </div>
          <button class="btn-close-profile" @click="closeModal">Return to Dashboard</button>
        </div>
      </div>
    </Transition>

    <AdminAiChatbot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import api from "../utils/api";
import { useAuthStore } from "../store/auth";
import AdminAiChatbot from "../components/AdminAiChatbot.vue";

const auth = useAuthStore();
const router = useRouter();

// State
const searchQuery = ref("");
const selectedStudent = ref<any>(null);
const students = ref<any[]>([]);
const currentView = ref('dashboard');
const showLogoutConfirm = ref(false); // Added for confirmation

const branchDistribution = computed(() => {
  const dist: Record<string, number> = {};
  students.value.forEach(s => {
    const b = s.course || "General";
    dist[b] = (dist[b] || 0) + 1;
  });
  return dist;
});

const filteredStudents = computed(() => {
  return students.value.filter(s => 
    s.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const getPercentage = (count: number) => (students.value.length ? (count / students.value.length) * 100 : 0);
const openModal = (s: any) => selectedStudent.value = s;
const closeModal = () => selectedStudent.value = null;

onMounted(async () => {
  try {
    const res = await api.get("/students");
    students.value = Array.isArray(res.data) ? res.data : (res.data.students || []);
  } catch (err) { console.error(err); }
});

const handleLogout = async () => {
  await auth.logout();
  showLogoutConfirm.value = false;
  router.push("/");
};
</script>

<style scoped>
/* ALL PREVIOUS CSS REMAINS UNCHANGED - ADDING NEW CONFIRMATION MODAL STYLES BELOW */

/* Confirmation Modal Styling */
.confirm-overlay {
  z-index: 1100; /* Higher than profile modal */
}

.confirm-card {
  width: 380px;
  background: #0f0f0f;
  border: 1px solid #222;
  border-radius: 24px;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 40px 80px rgba(0,0,0,0.8);
}

.confirm-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.confirm-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  color: #fff;
}

.confirm-card p {
  font-size: 0.9rem;
  color: #888;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.confirm-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-confirm-logout {
  padding: 1rem;
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.btn-confirm-logout:hover {
  background: #ff3333;
  transform: translateY(-2px);
}

.btn-cancel {
  padding: 1rem;
  background: #1a1a1a;
  color: #666;
  border: 1px solid #222;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.btn-cancel:hover {
  color: #fff;
  background: #222;
}

/* Include all styles from the previous message here... */
.admin-shell { --primary: #a855f7; --bg-darker: #050505; --sidebar-w: 260px; display: flex; min-height: 100vh; background: var(--bg-darker); color: #fff; font-family: 'Inter', sans-serif; }
.glow-overlay { position: fixed; inset: 0; background: radial-gradient(circle at 100% 0%, rgba(168, 85, 247, 0.08) 0%, transparent 50%); pointer-events: none; }
.sidebar { width: var(--sidebar-w); background: #0a0a0a; border-right: 1px solid #1a1a1a; display: flex; flex-direction: column; padding: 2rem 1rem; position: fixed; height: 100vh; z-index: 101; }
.brand { display: flex; align-items: center; gap: 12px; margin-bottom: 2.5rem; padding-left: 0.5rem; }
.logo-circle { width: 35px; height: 35px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; }
.brand-name { font-weight: 800; font-size: 1.1rem; letter-spacing: 1px; }
.accent { color: #f59e0b; }
.brand-status { display: block; font-size: 0.65rem; color: #22c55e; text-transform: uppercase; font-weight: 700; margin-top: 2px; }
.nav-section { margin-bottom: 1.5rem; }
.nav-label { font-size: 0.65rem; color: #444; text-transform: uppercase; font-weight: 800; margin-bottom: 0.8rem; display: block; padding-left: 1rem; letter-spacing: 0.5px; }
.nav-item { display: flex; align-items: center; gap: 12px; padding: 0.7rem 1rem; color: #888; text-decoration: none; border-radius: 10px; transition: 0.2s ease; margin-bottom: 4px; font-size: 0.9rem; cursor: pointer; }
.nav-item.active, .nav-item:hover { background: #151515; color: #fff; }
.sidebar-user-card { margin-top: 1rem; background: #111; padding: 1rem; border-radius: 15px; display: flex; gap: 12px; align-items: center; border: 1px solid #1a1a1a; }
.user-avatar { width: 38px; height: 38px; background: #1a1a1a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; color: var(--primary); border: 1px solid #222; }
.u-name { font-size: 0.85rem; font-weight: 700; margin: 0; }
.u-role { font-size: 0.7rem; color: #555; margin: 0; }
.navbar { height: 65px; border-bottom: 1px solid #1a1a1a; display: flex; justify-content: space-between; align-items: center; padding: 0 3rem; background: rgba(5,5,5,0.8); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 100; }
.nav-title { font-size: 1.1rem; font-weight: 700; margin: 0; color: #eee; }
.nav-logout-btn { background: #111; border: 1px solid #222; color: #ff4d4d; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
.nav-logout-btn:hover { background: #ff4d4d; color: white; border-color: #ff4d4d; transform: translateY(-1px); }
.main-content { margin-left: var(--sidebar-w); flex: 1; position: relative; }
.content-body { padding: 2.5rem 3rem; }
.dashboard-grid { display: grid; grid-template-columns: 260px 1fr; gap: 1.5rem; margin-bottom: 2rem; }
.stat-glass-card { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 1.5rem; border-radius: 18px; display: flex; align-items: center; gap: 18px; }
.stat-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; background: rgba(168, 85, 247, 0.08); color: var(--primary); border: 1px solid rgba(168, 85, 247, 0.1); }
.stat-data .label { font-size: 0.75rem; color: #555; font-weight: 600; }
.stat-data .value { font-size: 1.8rem; font-weight: 800; margin-top: 2px; }
.graph-card { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 1.5rem; border-radius: 18px; }
.card-title { font-size: 0.9rem; color: #555; margin-bottom: 1.2rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.graph-row { margin-bottom: 1rem; }
.graph-label { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.85rem; font-weight: 600; color: #aaa; }
.progress-container { height: 6px; background: #151515; border-radius: 10px; overflow: hidden; }
.progress-bar { height: 100%; background: var(--primary); border-radius: 10px; transition: width 1s ease; box-shadow: 0 0 10px rgba(168, 85, 247, 0.2); }
.table-container { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 18px; overflow: hidden; transition: all 0.4s ease; }
.table-header { padding: 1.2rem 1.8rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1a1a1a; }
.table-header h3 { font-size: 1rem; margin: 0; color: #ccc; }
.table-search { background: #111; border: 1px solid #222; padding: 0.6rem 1rem; border-radius: 10px; color: white; width: 220px; outline: none; font-size: 0.85rem; transition: 0.2s; }
.table-search:focus { border-color: var(--primary); background: #151515; }
.modern-table { width: 100%; border-collapse: collapse; }
th { text-align: left; padding: 1rem 1.8rem; color: #444; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 800; border-bottom: 1px solid #1a1a1a; }
td { padding: 1.1rem 1.8rem; border-bottom: 1px solid #0f0f0f; font-size: 0.85rem; color: #ddd; }
.student-info { display: flex; align-items: center; gap: 12px; font-weight: 600; }
.initial-circle { width: 30px; height: 30px; background: #151515; color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; border: 1px solid #222; }
.course-pill { background: rgba(168, 85, 247, 0.08); color: var(--primary); padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; }
.owner-tag { color: #666; font-size: 0.8rem; }
.btn-view-action { background: #151515; border: 1px solid #222; color: var(--primary); padding: 0.45rem 1rem; border-radius: 8px; cursor: pointer; transition: 0.2s; font-weight: 600; font-size: 0.8rem; }
.btn-view-action:hover { background: var(--primary); color: white; transform: scale(1.02); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); z-index: 1000; display: flex; align-items: center; justify-content: center; }
.profile-card { width: 440px; background: #0f0f0f; border-radius: 25px; border: 1px solid #222; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
.card-gradient-header { background: linear-gradient(to bottom, #151515, #0f0f0f); padding: 2.5rem 2rem 1.5rem; text-align: center; position: relative; border-bottom: 1px solid #1a1a1a; }
.close-card { position: absolute; top: 1.2rem; right: 1.2rem; background: none; border: none; color: #444; font-size: 1.1rem; cursor: pointer; }
.profile-avatar-wrapper { width: 85px; height: 85px; background: var(--primary); margin: 0 auto 1.2rem; border-radius: 22px; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; color: white; box-shadow: 0 10px 20px rgba(168, 85, 247, 0.2); }
.profile-name { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.3rem; }
.profile-course { color: var(--primary); font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; }
.profile-content { padding: 1.8rem; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
.info-item { display: flex; flex-direction: column; }
.info-item.full { grid-column: span 2; }
.info-label { font-size: 0.6rem; color: #555; text-transform: uppercase; font-weight: 800; margin-bottom: 4px; letter-spacing: 0.5px; }
.info-value { font-size: 0.9rem; color: #ccc; font-weight: 600; }
.btn-close-profile { width: 100%; padding: 1.1rem; background: #1a1a1a; border: none; color: #fff; font-weight: 700; cursor: pointer; transition: 0.2s; font-size: 0.9rem; border-top: 1px solid #222; }
.btn-close-profile:hover { background: #222; }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(30px); opacity: 0; }
.text-right { text-align: right; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>