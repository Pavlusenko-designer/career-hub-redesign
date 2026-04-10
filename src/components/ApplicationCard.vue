<template>
  <div class="application-card">
    <div class="card-header">
      <div class="header-titles">
        <h3 class="job-title ds-title-card">{{ title }}</h3>
        <p class="job-team ds-body-sm">{{ team }}</p>
        <p class="applied-date ds-meta">{{ metaLabel }}</p>
      </div>
      <div class="header-actions">
        <Tag :value="statusConfig.label" :class="['status-tag', statusClass]" />
        <Button icon="pi pi-ellipsis-v" text rounded severity="secondary" class="menu-btn" @click="toggleMenu" />
        <Menu ref="menu" :model="menuItems" :popup="true" />
      </div>
    </div>

    <div class="card-body">
      <div class="job-details">
        <InfoChip icon="pi pi-sitemap" :label="department" />
        <InfoChip icon="pi pi-map-marker" :label="location" />
        <InfoChip icon="pi pi-briefcase" :label="jobId" />
      </div>

      <p class="job-description ds-body">{{ description }}</p>

      <div v-if="showHighlight" class="application-highlight">
        <i :class="statusConfig.highlightIcon"></i>
        <span>{{ nextStepText }}</span>
      </div>
    </div>

    <div class="card-footer">
      <Button
        label="View Details"
        icon="pi pi-arrow-right"
        severity="primary"
        class="action-btn"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Menu from 'primevue/menu';
import InfoChip from './InfoChip.vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Senior Product Designer'
  },
  team: {
    type: String,
    default: 'Product Design'
  },
  department: {
    type: String,
    default: 'Experience Design'
  },
  appliedDate: {
    type: String,
    default: 'Feb 20, 2026'
  },
  lastUpdated: {
    type: String,
    default: 'Updated 2 days ago'
  },
  status: {
    type: String,
    default: 'in_review'
  },
  description: {
    type: String,
    default: 'Some position description goes here Some position description goes here Some position description goes here.'
  },
  nextStep: {
    type: String,
    default: ''
  },
  showHighlight: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    default: 'New York, NY Office'
  },
  jobId: {
    type: String,
    default: 'R1495971'
  }
});

const STATUS_CONFIG = {
  submitted: {
    label: 'Submitted',
    highlightIcon: 'pi pi-send',
    defaultNextStep: 'Your application was received and is waiting for the hiring team to begin review.'
  },
  in_review: {
    label: 'In Review',
    highlightIcon: 'pi pi-search',
    defaultNextStep: 'Hiring team is reviewing your portfolio and role alignment.'
  },
  assessment: {
    label: 'Assessment',
    highlightIcon: 'pi pi-bolt',
    defaultNextStep: 'Complete the take-home exercise before the deadline to stay in process.'
  },
  interview: {
    label: 'Interview',
    highlightIcon: 'pi pi-calendar',
    defaultNextStep: 'Choose a time slot and confirm your interview details.'
  },
  final_round: {
    label: 'Final Round',
    highlightIcon: 'pi pi-star',
    defaultNextStep: 'Your final panel is ready. Review the agenda and interviewer notes.'
  },
  offer: {
    label: 'Offer',
    highlightIcon: 'pi pi-check-circle',
    defaultNextStep: 'An offer is ready for review. Confirm compensation and benefits before signing.'
  },
  rejected: {
    label: 'Closed',
    highlightIcon: 'pi pi-lock',
    defaultNextStep: 'This role is closed, but you can still review the application details and history.'
  }
};

const menu = ref(null);

const statusConfig = computed(() => STATUS_CONFIG[props.status] || STATUS_CONFIG.in_review);
const statusClass = computed(() => `status-${props.status}`);
const nextStepText = computed(() => props.nextStep || statusConfig.value.defaultNextStep);
const metaLabel = computed(() => props.lastUpdated);

const menuItems = computed(() => [
  {
    label: 'Edit application',
    icon: 'pi pi-pencil'
  },
  {
    label: 'Withdraw application',
    icon: 'pi pi-ban'
  }
]);

const toggleMenu = (event) => {
  menu.value?.toggle(event);
};
</script>

<style scoped>
.application-card {
  background-color: var(--bg-default);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.menu-btn {
  width: 2rem;
  height: 2rem;
  padding: 0;
}

.job-title,
.job-team,
.applied-date {
  margin: 0;
}

.status-tag {
  border-radius: 999px;
  padding: 4px 9px;
  font-size: 12px;
  font-weight: 600;
}

.status-submitted { background-color: #eef2ff; color: #4450a8; }
.status-in_review { background-color: #e8f1ff; color: #1456a0; }
.status-assessment { background-color: #fff4dc; color: #9a6600; }
.status-interview { background-color: #d8f4f2; color: #1d3734; }
.status-final_round { background-color: #f3eaff; color: #6e3fba; }
.status-offer { background-color: #e3f7e8; color: #1b6b37; }
.status-rejected { background-color: #f2f4f7; color: #667085; }

.card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
}

.job-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.application-highlight {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  background-color: #f7f9fc;
  color: var(--text-strong);
  font-size: 13px;
  line-height: 19px;
}

.application-highlight i {
  margin-top: 2px;
  color: var(--primary-bg);
}

.job-details {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.card-footer {
  margin-top: auto;
}

.action-btn {
  width: 100%;
  border-radius: 10px;
  padding: 8px 12px;
  font-weight: 500;
  font-size: 13px;
  justify-content: center;
}

@media (max-width: 768px) {
  .application-card {
    padding: 16px;
    gap: 14px;
  }

  .card-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    justify-content: space-between;
  }
}
</style>
