<template>
  <div class="onboarding-widget">
    <div class="widget-content">
      <div class="text-content">
        <span class="eyebrow">Profile Completion</span>
        <h2 class="title">{{ currentStepData.title }}</h2>
        <p class="subtitle">{{ currentStepData.subtitle }}</p>
      </div>
      <div class="action-content">
        <Button 
          :label="currentStepData.buttonLabel" 
          icon="pi pi-arrow-right" 
          severity="primary" 
          @click="nextStep" 
        />
      </div>
    </div>
    
    <div class="progress-container">
      <ProgressBar :value="progressPercentage" :showValue="false" class="custom-progress"></ProgressBar>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';

const steps = [
  {
    title: "Welcome back, Alex!",
    subtitle: "Update your preferences (job title, location) to get started.",
    buttonLabel: "Update Preferences"
  },
  {
    title: "Preferences saved!",
    subtitle: "Upload your CV to let our matching algorithm do the work.",
    buttonLabel: "Upload CV"
  },
  {
    title: "Resume processed!",
    subtitle: "View the roles that perfectly map to your experience.",
    buttonLabel: "View Matches"
  },
  {
    title: "Matches found!",
    subtitle: "You have great potential fits. Let's send out an application.",
    buttonLabel: "Apply to Job"
  },
  {
    title: "Application accepted!",
    subtitle: "The employer wants to meet you. Pick a time slot.",
    buttonLabel: "Schedule Interview"
  },
  {
    title: "Interview scheduled!",
    subtitle: "Acknowledge and pass your interview session!",
    buttonLabel: "Attend Interview"
  },
  {
    title: "You passed!",
    subtitle: "Amazing job! You have an outstanding offer waiting for signature.",
    buttonLabel: "Sign Offer"
  },
  {
    title: "Congratulations, Alex!",
    subtitle: "100% completed. You are officially hired! Your next career journey begins.",
    buttonLabel: "Start Over"
  }
];

const currentIndex = ref(0);

const currentStepData = computed(() => steps[currentIndex.value]);

const progressPercentage = computed(() => {
  if (currentIndex.value === steps.length - 1) return 100;
  return Math.round((currentIndex.value / (steps.length - 1)) * 100);
});

const nextStep = () => {
  if (currentIndex.value < steps.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0;
  }
};
</script>

<style scoped>
.onboarding-widget {
  background-color: var(--bg-default);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.widget-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
}

.text-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 720px;
}

.eyebrow {
  color: #ff7640;
  font-size: 14px;
  font-weight: 500;
}

.title {
  font-size: 38px;
  line-height: 1.1;
  font-weight: 600;
  color: var(--text-strong);
  margin: 0;
}

.subtitle {
  font-size: 16px;
  line-height: 26px;
  color: var(--text-subtle);
  margin: 0;
}

.action-content {
  flex-shrink: 0;
}

.progress-container {
  display: flex;
  align-items: center;
}

.custom-progress {
  flex-grow: 1;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
}

:deep(.p-progressbar .p-progressbar-value) {
  background-color: var(--primary-bg);
}

@media (max-width: 768px) {
  .widget-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .title {
    font-size: 30px;
  }

  .progress-container {
    width: 100%;
  }
}
</style>
