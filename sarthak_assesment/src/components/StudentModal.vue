<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="glass-modal-card">
      <div class="modal-blob"></div>

      <div class="modal-header">
        <h2 class="section-title">
          {{ student ? 'Update' : 'Enroll' }} 
          <span class="gradient-text">Student</span>
        </h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="submit" class="premium-form">
        <div class="photo-section">
          <label class="field-label">Student Portrait</label>
          <div class="upload-zone" :class="{ 'has-img': preview }">
            <input type="file" @change="onFile" id="file-input" hidden accept="image/*" />
            <label for="file-input" class="upload-label">
              <div v-if="!preview" class="upload-placeholder">
                <span class="icon">📸</span>
                <p>Click to Upload</p>
              </div>
              <img v-else :src="preview" class="image-preview" />
              <div v-if="preview" class="change-overlay">Replace Photo</div>
            </label>
          </div>
          <p class="helper-text">Formats: JPG, PNG, WebP</p>
        </div>

        <div class="form-grid">
          <div class="input-group full">
            <label>Full Name</label>
            <input v-model="form.name" placeholder="John Doe" required />
          </div>

          <div class="input-group">
            <label>Email</label>
            <input v-model="form.email" type="email" placeholder="john@example.com" />
          </div>

          <div class="input-group">
            <label>Phone</label>
            <input v-model="form.phone" placeholder="+1 (555) 000-0000" />
          </div>

          <div class="input-group">
            <label>Age</label>
            <input v-model="form.age" type="number" placeholder="20" />
          </div>

          <div class="input-group">
            <label>Gender</label>
            <select v-model="form.gender">
              <option value="" disabled>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div class="input-group full">
            <label>Course / Major</label>
            <input v-model="form.course" placeholder="B.Sc. Computer Science" />
          </div>

          <div class="input-group full">
            <label>Address</label>
            <textarea v-model="form.address" placeholder="Residential Address..." rows="2"></textarea>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="$emit('close')" :disabled="loading">Discard</button>
          <button type="submit" class="btn-save" :disabled="loading">
            <span v-if="!loading">{{ student ? 'Update Records' : 'Save Student' }}</span>
            <div v-else class="spinner"></div>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{ student?: any }>();
const emit = defineEmits(["save", "close"]);

const form = ref<any>({ gender: "" });
const file = ref<File | null>(null);
const preview = ref<string | null>(null);
const loading = ref(false);

watch(
  () => props.student,
  (s) => {
    if (s) {
      form.value = { ...s };
      preview.value = s.image ? `${import.meta.env.VITE_API_URL}${s.image}` : null;
    } else {
      form.value = { gender: "" };
      preview.value = null;
    }
  },
  { immediate: true }
);

const onFile = (e: Event) => {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (!f) return;
  file.value = f;
  preview.value = URL.createObjectURL(f);
};

const submit = async () => {
  loading.value = true;
  const fd = new FormData();
  
  // Clean empty fields and build FormData
  Object.keys(form.value).forEach((k) => {
    if (form.value[k] !== null && form.value[k] !== undefined) {
      fd.append(k, form.value[k]);
    }
  });
  
  if (file.value) fd.append("image", file.value);

  // We await the emit to stop the loading spinner once parent finishes
  await emit("save", fd);
  loading.value = false;
};
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; z-index: 2000;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}

.glass-modal-card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  width: 100%; max-width: 680px;
  padding: 2.5rem; position: relative; overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-blob {
  position: absolute; top: -100px; right: -100px;
  width: 250px; height: 250px; background: #6366f1;
  filter: blur(100px); opacity: 0.2; pointer-events: none;
}

.modal-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
}

.section-title { font-size: 1.8rem; font-weight: 800; color: #fff; margin: 0; }
.gradient-text { background: linear-gradient(90deg, #818cf8, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.close-btn { background: none; border: none; color: #94a3b8; font-size: 2.5rem; cursor: pointer; transition: 0.3s; }
.close-btn:hover { color: #fff; transform: rotate(90deg); }

.premium-form { display: grid; grid-template-columns: 180px 1fr; gap: 2.5rem; }

/* Photo Section */
.upload-zone {
  width: 100%; height: 200px; border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 20px; overflow: hidden; position: relative; transition: 0.3s;
}
.upload-zone:hover { border-color: #6366f1; background: rgba(99, 102, 241, 0.05); }

.upload-label { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.upload-placeholder { text-align: center; color: #64748b; }
.upload-placeholder .icon { font-size: 2.5rem; display: block; margin-bottom: 10px; }

.image-preview { width: 100%; height: 100%; object-fit: cover; }
.change-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 0.8rem; font-weight: 700; opacity: 0; transition: 0.3s;
}
.upload-zone:hover .change-overlay { opacity: 1; }

/* Form Grid */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
.full { grid-column: span 2; }

.input-group { display: flex; flex-direction: column; gap: 6px; }
.input-group label { font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }

input, select, textarea {
  background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.8rem 1rem; border-radius: 12px; color: #fff; font-size: 0.9rem; outline: none; transition: 0.3s;
}
input:focus, select:focus, textarea:focus { border-color: #6366f1; background: rgba(15, 23, 42, 0.8); }

.modal-actions {
  grid-column: span 2; display: flex; justify-content: flex-end; gap: 1rem;
  margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-cancel { background: transparent; color: #94a3b8; border: none; padding: 0.8rem 1.5rem; cursor: pointer; font-weight: 600; }
.btn-save {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: #fff; border: none; padding: 0.8rem 2rem; border-radius: 12px;
  font-weight: 700; cursor: pointer; transition: 0.3s; min-width: 140px;
  display: flex; align-items: center; justify-content: center;
}
.btn-save:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3); }

/* Loading Spinner */
.spinner {
  width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%; border-top-color: #fff; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 650px) {
  .premium-form { grid-template-columns: 1fr; }
  .photo-section { display: flex; flex-direction: column; align-items: center; }
  .upload-zone { width: 160px; height: 160px; }
  .form-grid { grid-template-columns: 1fr; }
  .full { grid-column: span 1; }
}
</style>