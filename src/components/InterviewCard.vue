<template>
  <div class="interview-card">
    <Tag :value="statusLabel" :class="['status-tag', statusClass]" />

    <div class="card-content">
      <h3 class="job-title ds-title-card">{{ title }}</h3>

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
      <Button label="View Details" class="p-button-secondary action-btn" outlined />
      <Button v-if="primaryActionText" :label="primaryActionText" class="p-button-primary action-btn view-details-btn" :icon="primaryActionIcon" />
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
    default: 'not_started'
  },
  description: {
    type: String,
    default: 'Some position description goes here Some position description goes here Some position description goes here Some position description goes here.'
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
  switch (props.status) {
    case 'accepted': return 'Scheduled';
    case 'in_progress': return 'Confirmed';
    case 'not_started':
    default: return 'Needs Scheduling';
  }
});

const statusClass = computed(() => `status-${props.status}`);

const formatIcon = computed(() => {
  return props.format.toLowerCase().includes('google') || props.format.toLowerCase().includes('video')
    ? 'pi pi-video'
    : 'pi pi-map-marker';
});

const primaryActionText = computed(() => {
  switch (props.status) {
    case 'accepted': return 'Reschedule';
    case 'in_progress': return 'Join Call';
    case 'not_started':
    default: return 'Schedule';
  }
});

const primaryActionIcon = computed(() => {
  switch (props.status) {
    case 'accepted': return 'pi pi-calendar-plus';
    case 'in_progress': return 'pi pi-video';
    case 'not_started':
    default: return 'pi pi-calendar-plus';
  }
});
</script>

<style scoped>
.interview-card {
  position: relative;
  background-color: var(--bg-default);
  border: 1px solid var(--border-color);
  border-radius: 12px;
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
  gap: 10px;
  flex-grow: 1;
  min-width: 0;
  padding-right: 132px;
}

.job-title {
  margin: 0;
}

.status-tag {
  position: absolute;
  top: 24px;
  right: 24px;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}

.status-not_started { background-color: #eef1f5; color: #445066; }
.status-accepted { background-color: #dff6f1; color: #1d4c45; }
.status-in_progress { background-color: #e8edff; color: #3149a6; }

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
  margin-top: 4px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-subtle);
}

.detail-item i {
  font-size: 12px;
}

.time-badge {
  background-color: #eef1f5;
  border-radius: 999px;
  padding: 4px 8px;
  color: #445066;
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
  background-color: #e8edff;
  color: #445066;
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
  gap: 12px;
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

  .card-content {
    padding-right: 0;
  }

  .status-tag {
    position: static;
    align-self: flex-start;
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
