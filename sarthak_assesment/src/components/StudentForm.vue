<template>
  <form class="student-form-premium" @submit.prevent="submitForm">
    <div class="form-layout-grid">
      
      <div class="photo-section">
        <div class="profile-preview-wrapper">
          <div class="profile-preview">
            <img v-if="imagePreview" :src="imagePreview" />
            <div v-else class="placeholder-icon">👤</div>
          </div><br>
          <label class="glass-upload-btn">
            <span>Change Photo</span>
            <input type="file" accept="image/*" hidden @change="handleImage" />
          </label>
        </div>
        <p class="upload-info">Upload a professional headshot (Max 2MB)</p>
      </div>

      <div class="data-section">
        <div class="form-group full-width">
          <label>Full Name</label>
          <input v-model="form.name" placeholder="Enter student's full name" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Age</label>
            <input v-model="form.age" type="number" placeholder="20" required />
          </div>
          <div class="form-group">
            <label>Gender</label>
            <select v-model="form.gender">
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Email Address</label>
            <input v-model="form.email" type="email" placeholder="email@university.edu" />
          </div>
          <div class="form-group">
            <label>Phone Number</label>
            <input v-model="form.phone" type="tel" placeholder="+1 234..." />
          </div>
        </div>

        <div class="form-group full-width">
          <label>Residential Address</label>
          <textarea v-model="form.address" rows="2" placeholder="Street, City, State..."></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Course / Discipline</label>
            <select v-model="form.course" required>
              <option value="">Select Course</option>
              <option>BCA</option>
              <option>BSc</option>
              <option>BCom</option>
            </select>
          </div>
          <div class="form-group">
            <label>Enrollment Date</label>
            <input v-model="form.enrollmentDate" type="date" />
          </div>
        </div>
      </div>
    </div>

    <div class="form-actions-premium">
      <button type="button" class="btn-glass-cancel" @click="cancelEdit">Discard Changes</button>
      <button type="submit" class="btn-primary-gradient">
        {{ props.student ? 'Update Academic Record' : 'Complete Enrollment' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

const props = defineProps({ student: Object })
const emit = defineEmits(['add-student','edit-student','cancel-edit'])

const imagePreview = ref(null)
const form = reactive({
  id: null,
  name: '',
  age: '',
  email: '',
  phone: '',
  gender: '',
  course: '',
  address: '',
  enrollmentDate: '',
  image: null
})

// Prefill form for editing
watch(() => props.student, (newVal) => {
  if (newVal) Object.assign(form, newVal), imagePreview.value = newVal.image ?? null
  else Object.keys(form).forEach(k => form[k] = k === 'id' ? null : ''), imagePreview.value = null
}, { immediate: true })

const handleImage = e => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => (imagePreview.value = reader.result, form.image = reader.result)
  reader.readAsDataURL(file)
}

const submitForm = () => {
  if (!form.name || !form.age || !form.course) return alert("Name, age, course required")
  if (form.id) emit('edit-student', { ...form })
  else emit('add-student', { ...form })
}

const cancelEdit = () => emit('cancel-edit')
</script>

<script>
import './StudentForm.css'
</script>
