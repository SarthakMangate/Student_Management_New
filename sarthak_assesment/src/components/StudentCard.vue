<template>
  <div class="student-card-premium">
    <div class="card-main-content">
      <div class="avatar-wrapper">
        <img v-if="student.image" :src="student.image" class="premium-avatar"
          style="width: 200px; border-radius: 50%; height: 200px;" />
        <div v-else class="avatar-icon">👤</div>
      </div>

      <div class="card-info-block">
        <h3 class="student-name-text">{{ student.name }}</h3>

        <div class="pill-row">
          <span class="pill-item"><strong>Age : </strong>{{ student.age }}</span> &nbsp;
          <span>|</span>&nbsp;
          <span class="pill-item-accent"><strong>Course : </strong>{{ student.course }}</span>
        </div>

        <div class="details-stack">
          <span class="detail-line"><strong>Email :</strong> {{ student.email }}</span>&nbsp;
          <span>|</span>&nbsp;
          <span class="pill-item"><strong>Gender : </strong>{{ student.gender }}</span>
          <p class="detail-line"><strong>Phone :</strong> {{ student.phone }}</p>
          <p class="detail-line"><strong>Joined   :</strong> {{ student.enrollmentDate || 'N/A' }}</p>
        </div>
      </div>
    </div>

    <div class="card-actions-sidebar">
      <button class="action-btn edit-trigger" @click="$emit('edit-student', student)" style="  padding: 8px 14px !important;
  border-radius: 10px !important; /* Changed from 50% for better UI */
  font-weight: 700 !important;
  font-size: 0.7rem !important;
  cursor: pointer !important;
  border: 1px solid transparent !important;
  min-width: 75px !important;
  transition: all 0.2s ease !important;
  text-transform: uppercase;">Edit</button><br><br>
      <button class="action-btn delete-trigger" @click="$emit('delete-student', student.id)" style="  padding: 8px 14px !important;
  border-radius: 10px !important; /* Changed from 50% for better UI */
  font-weight: 700 !important;
  font-size: 0.7rem !important;
  cursor: pointer !important;
  border: 1px solid transparent !important;
  min-width: 75px !important;
  transition: all 0.2s ease !important;
  text-transform: uppercase;">Delete</button>
    </div>
  </div>
</template>

<script setup>
defineProps({ student: Object })
defineEmits(['edit-student', 'delete-student'])
</script>