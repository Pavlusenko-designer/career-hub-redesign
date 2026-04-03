<template>
  <div class="interview-card">
    <div class="card-content">
      <div class="header-row">
        <h3 class="job-title ds-title-card">{{ title }}</h3>
        <Tag :value="statusLabel" :class="['status-tag', statusClass]" />
      </div>
      
      <p class="job-description ds-body">{{ description }}</p>
      
      <div class="details-row">
        <div class="detail-item">
          <i class="pi pi-calendar"></i>
          <span>{{ date }}</span>
        </div>
        <span class="separator">·</span>
        <div class="detail-item time-badge">
          <i class="pi pi-clock"></i>
          <span>{{ time }}</span>
        </div>
        <span class="separator">·</span>
        <div class="detail-item">
          <i :class="formatIcon"></i>
          <span>{{ format }}</span>
        </div>
        <span class="separator">·</span>
        <div class="avatar-group">
          <Avatar :label="avatarLabel" shape="circle" class="attendee-avatar" />
        </div>
      </div>
    </div>
    
    <div class="actions-container">
      <Button v-if="primaryActionText" :label="primaryActionText" class="p-button-secondary action-btn" :icon="primaryActionIcon" />
      <Button label="View Details" class="p-button-primary action-btn view-details-btn" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Avatar from 'primevue/avatar';

const props = defineProps({
  title: {
    type: String,
    default: 'Product Manager'
  },
  status: {
    type: String,
    default: 'not_started' // 'not_started', 'accepted', 'in_progress'
  },
  description: {
    type: String,
    default: 'Some position description goes here Some position description goes here Some position description goes here Some position description goes here Some position description goes here Some position description goes here Some position description goes here'
  },
  date: {
    type: String,
    default: 'Mar 3, 2026'
  },
  time: {
    type: String,
    default: '2:00 PM EST'
  },
  format: {
    type: String,
    default: 'Google Meet'
  },
  avatarLabel: {
    type: String,
    default: 'M'
  }
});

const statusLabel = computed(() => {
  switch(props.status) {
    case 'accepted': return 'Accepted';
    case 'in_progress': return 'In Progress';
    case 'not_started': default: return 'Not Started';
  }
});

const statusClass = computed(() => {
  return `status-${props.status}`;
});

const formatIcon = computed(() => {
  return props.format.toLowerCase().includes('google') || props.format.toLowerCase().includes('video') 
    ? 'pi pi-video' 
    : 'pi pi-map-marker';
});

const primaryActionText = computed(() => {
  switch(props.status) {
    case 'accepted': return 'Reschedule';
    case 'in_progress': return 'Join Call';
    case 'not_started': default: return 'Schedule';
  }
});

const primaryActionIcon = computed(() => {
  switch(props.status) {
    case 'accepted': return 'pi pi-calendar-plus';
    case 'in_progress': return 'pi pi-video';
    case 'not_started': default: return 'pi pi-calendar-plus';
  }
});
</script>

<style scoped>
.interview-card {
  background-color: var(--bg-default);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  width: 100%;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.job-title {
  margin: 0;
}

.status-tag {
  border-radius: 6px;
  padding: 4px 6px;
  font-size: 14px;
  font-weight: 400;
}

.status-not_started { background-color: #e8eaee; color: #353b46; }
.status-accepted { background-color: #d8f4f2; color: #1d3734; }
.status-in_progress { background-color: #eae8fb; color: #2927b2; }

.job-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.details-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-subtle);
}

.detail-item i {
  font-size: 12px;
}

.time-badge {
  background-color: #e8eaee;
  border-radius: 6px;
  padding: 3px 6px;
  color: #353b46;
}

.separator {
  color: var(--text-subtle);
  font-size: 12px;
}

.avatar-group {
  display: flex;
  align-items: center;
}

.attendee-avatar {
  background-color: #eae8fb;
  color: #464f5e;
  width: 24px;
  height: 24px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.actions-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 16px;
  flex-shrink: 0;
}

.action-btn {
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 500;
  font-size: 14px;
}

.view-details-btn {
  background-color: var(--primary-bg);
  color: white;
}

@media (max-width: 768px) {
  .interview-card {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
    gap: 16px;
  }

  .header-row {
    align-items: flex-start;
    gap: 12px;
  }

  .job-title {
    width: 100%;
  }

  .job-description {
    -webkit-line-clamp: 3;
  }

  .details-row {
    gap: 10px;
  }

  .separator {
    display: none;
  }

  .detail-item,
  .time-badge,
  .avatar-group {
    min-height: 32px;
    border-radius: 999px;
    padding: 6px 10px;
    background-color: #f6f8fb;
  }

  .time-badge {
    padding: 6px 10px;
  }

  .avatar-group {
    padding: 4px;
  }

  .actions-container {
    width: 100%;
    flex-direction: column;
    gap: 12px;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
