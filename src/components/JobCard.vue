<template>
  <div class="job-card">
    <div class="card-header">
      <h3 class="job-title ds-title-card">{{ title }}</h3>
      <Button icon="pi pi-heart-fill" class="p-button-rounded p-button-text favorite-btn" />
    </div>
    
    <div class="card-body">
      <div class="job-details">
        <InfoChip icon="pi pi-tag" :label="category" />
        <InfoChip icon="pi pi-map-marker" :label="location" />
        <InfoChip icon="pi pi-clock" :label="workType" />
        <InfoChip icon="pi pi-briefcase" :label="jobId" />
      </div>

      <p class="job-description ds-body">{{ description }}</p>
    </div>
    
    <div class="card-footer">
      <Button label="Apply Now" icon="pi pi-arrow-right" severity="primary" class="apply-btn" />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
import InfoChip from './InfoChip.vue';

defineProps({
  title: {
    type: String,
    default: 'Senior Product Designer'
  },
  description: {
    type: String,
    default: 'Some position description goes here Some position description goes here Some position description goes here Some position description goes here Some position description goes here Some position description goes here Some position description goes here'
  },
  category: {
    type: String,
    default: 'Product Design'
  },
  location: {
    type: String,
    default: 'New York, NY Office'
  },
  workType: {
    type: String,
    default: 'Full-time'
  },
  jobId: {
    type: String,
    default: 'R1495971'
  }
});
</script>

<style scoped>
.job-card {
  background-color: var(--bg-default);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.job-title {
  margin: 0;
}

.favorite-btn {
  color: var(--secondary-text) !important;
  height: 2rem;
  width: 2rem;
  padding: 0;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex-grow: 1;
}

.job-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.job-details {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.card-footer {
  margin-top: auto;
}

.apply-btn {
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 500;
  font-size: 14px;
  justify-content: center;
}

@media (max-width: 768px) {
  .job-card {
    padding: 18px;
    gap: 16px;
  }
}
</style>
