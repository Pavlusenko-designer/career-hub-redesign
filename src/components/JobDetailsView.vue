<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import AppIcon from './AppIcon.vue';
import InfoChip from './InfoChip.vue';
import InterviewCard from './InterviewCard.vue';
import { store } from '../store';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const router = useRouter();

const job = computed(() => {
  // Search in interviews first (since the original logic passed an interview object to view-details)
  const interviewMatch = store.interviews.find(i => i.jobId === props.id || i.title === props.id);
  if (interviewMatch) return interviewMatch;
  
  // Search in saved jobs
  const jobMatch = store.savedJobs.find(j => j.jobId === props.id);
  if (jobMatch) return jobMatch;
  
  // Search in applications
  const appMatch = store.activeApplications.find(a => a.jobId === props.id);
  if (appMatch) return appMatch;

  return null;
});

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push({ name: 'Dashboard' });
  }
};
</script>

<template>
  <div class="job-details-view">
    <div class="job-details-header">
      <Button class="back-btn p-button-text p-button-plain" @click="goBack">
        <template #icon>
          <AppIcon name="arrow-left" />
        </template>
        <span>Back</span>
      </Button>
    </div>

    <section class="dashboard-section">
      <div class="widget-card details-card">
        <div class="header-content">
          <h1 class="job-role-title ds-title-section">{{ job?.title || 'Product Manager' }}</h1>
          <div class="job-meta">
            <InfoChip icon-name="map-marker" label="Toronto, Canada" />
            <InfoChip icon-name="briefcase" label="Product" />
            <InfoChip icon-name="clock" label="Full-time" />
          </div>
        </div>

        <div class="job-description ds-body">
          <h2 class="ds-title-card">About the Role</h2>
          <p>
            We are looking for a highly motivated Product Manager to drive product direction for a key platform area. You will work closely with design and engineering to deliver measurable impact.
          </p>

          <h2 class="ds-title-card">Responsibilities</h2>
          <ul>
            <li>Define and execute the product roadmap for your respective domain.</li>
            <li>Collaborate with UX/UI designers to create intuitive, user-centric experiences.</li>
            <li>Analyze user feedback and product metrics to iterate and improve features.</li>
            <li>Partner with engineering teams in an agile environment to ensure smooth delivery.</li>
          </ul>

          <h2 class="ds-title-card">Requirements</h2>
          <ul>
            <li>3+ years of product management experience, preferably in tech or SaaS platforms.</li>
            <li>Strong analytical skills and data-driven decision making.</li>
            <li>Excellent communication and stakeholder management skills.</li>
          </ul>
        </div>
      </div>
    </section>

    <section v-if="job" class="dashboard-section mt-10">
      <div class="section-header">
        <div class="title-area">
          <h2>Interview Details</h2>
          <p class="subtitle">Your scheduled interview for this role</p>
        </div>
      </div>
      <div class="cards-list-vertical">
        <InterviewCard v-bind="job" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.job-details-view {
  width: 100%;
}

.job-details-header {
  margin-bottom: 24px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 500;
  color: var(--text-default);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.back-btn:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.details-card {
  gap: 32px;
}

.job-role-title {
  margin: 0 0 16px 0;
  font-size: 32px;
}

.job-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.job-description {
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: var(--text-default);
  line-height: 1.6;
}

.job-description h2 {
  margin: 24px 0 8px 0;
  font-size: 20px;
  color: var(--text-strong);
}

.job-description h2:first-child {
  margin-top: 0;
}

.job-description ul {
  padding-left: 20px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mt-10 {
  margin-top: 40px;
}
</style>
