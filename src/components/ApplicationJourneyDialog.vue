<template>
  <Dialog
    :visible="visible"
    modal
    :closable="false"
    :draggable="false"
    :style="{ width: 'min(calc(100% - 32px), 58rem)' }"
    class="journey-dialog"
    @update:visible="emit('update:visible', $event)"
  >
    <template #container>
      <div class="journey-modal">
        <div class="journey-header">
          <div class="journey-title-block">
            <span class="ds-eyebrow">Journey tracker</span>
            <h2>Candidate Journey Tracker</h2>
            <p>{{ title }} is in motion. Here is what is happening now.</p>
          </div>
          <Button text rounded severity="secondary" class="journey-close" aria-label="Close journey tracker" @click="closeDialog">
            <template #icon>
              <AppIcon name="times" />
            </template>
          </Button>
        </div>

        <div class="journey-role-summary">
          <div>
            <p class="journey-role-title">{{ title }}</p>
            <p class="journey-role-meta">{{ department }} · {{ location }} · {{ jobId }}</p>
          </div>
          <Tag :value="statusMeta.badge" :class="['journey-status', `journey-status-${status}`]" />
        </div>

        <section class="journey-progress" aria-label="Application journey progress">
          <div class="journey-progress-track">
            <span class="journey-progress-fill" :style="{ width: `${progressPercent}%` }" />
          </div>

          <ol class="journey-steps">
            <li
              v-for="(stage, index) in stages"
              :key="stage"
              class="journey-step"
              :class="{
                'journey-step-complete': index < currentStageIndex,
                'journey-step-current': index === currentStageIndex
              }"
            >
              <span class="journey-step-marker">
                <AppIcon v-if="index < currentStageIndex" name="check" />
              </span>
              <span class="journey-step-label">{{ stage }}</span>
            </li>
          </ol>
        </section>

        <section class="journey-current-panel">
          <div class="journey-current-copy">
            <span class="journey-panel-label">Current stage</span>
            <h3>{{ statusMeta.stage }}</h3>
            <p>{{ statusMeta.description }}</p>
          </div>
          <div class="journey-current-stat">
            <AppIcon name="clock" />
            <span>{{ statusMeta.timing }}</span>
          </div>
        </section>

        <div class="journey-detail-grid">
          <section class="journey-detail-panel">
            <div class="journey-panel-header">
              <AppIcon name="sync" />
              <h3>Recent activity</h3>
            </div>
            <ol class="journey-activity-list">
              <li v-for="activity in statusMeta.activities" :key="activity">
                <span class="journey-activity-dot" />
                <span>{{ activity }}</span>
              </li>
            </ol>
          </section>

          <section class="journey-detail-panel journey-next-panel">
            <div class="journey-panel-header">
              <AppIcon name="arrow-right" />
              <h3>Next step</h3>
            </div>
            <p>{{ nextStepText }}</p>
            <div class="journey-updated">
              <span>Last update</span>
              <strong>{{ lastUpdated }}</strong>
            </div>
          </section>
        </div>

        <div class="journey-footer">
          <Button label="Close" severity="secondary" outlined class="journey-footer-btn" @click="closeDialog" />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import AppIcon from './AppIcon.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Senior Product Designer'
  },
  department: {
    type: String,
    default: 'Product Design'
  },
  location: {
    type: String,
    default: 'Remote, US'
  },
  jobId: {
    type: String,
    default: 'R-10291'
  },
  appliedDate: {
    type: String,
    default: 'Mar 16, 2026'
  },
  lastUpdated: {
    type: String,
    default: 'Updated today'
  },
  status: {
    type: String,
    default: 'in_review'
  },
  nextStep: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:visible']);

const stages = ['Application', 'Recruiter Review', 'Manager Review', 'Interviews', 'Offer', 'Onboarding'];

const JOURNEY_META = {
  submitted: {
    badge: 'Submitted',
    stage: 'Application submitted',
    stageIndex: 0,
    timing: 'Received',
    description: 'Your application has been received and added to the recruiting queue.',
    activities: ['Application submitted', 'Confirmation email sent', 'Candidate profile attached to this role'],
    nextStep: 'Recruiting will begin the initial review and share an update when there is movement.'
  },
  in_review: {
    badge: 'In Review',
    stage: 'Recruiter Review',
    stageIndex: 1,
    timing: 'Typical time: 2-4 days',
    description: 'Your profile is being reviewed for role fit, availability, and required experience.',
    activities: ['Application submitted', 'Confirmation email sent', 'Recruiter reviewing resume'],
    nextStep: 'Profile shared with the hiring manager if shortlisted.'
  },
  assessment: {
    badge: 'Assessment',
    stage: 'Manager Review',
    stageIndex: 2,
    timing: 'Usually reviewed this week',
    description: 'The hiring team is comparing your experience with the role requirements.',
    activities: ['Recruiter screen completed', 'Profile sent to hiring manager', 'Assessment step prepared'],
    nextStep: 'Complete the assessment when it is assigned so the team can continue the review.'
  },
  interview: {
    badge: 'Interview',
    stage: 'Interviews',
    stageIndex: 3,
    timing: 'Scheduling in progress',
    description: 'The team is coordinating interview availability and preparing discussion topics.',
    activities: ['Hiring manager approved next step', 'Interview team selected', 'Scheduling options being checked'],
    nextStep: 'Choose an interview time and review the agenda before the conversation.'
  },
  final_round: {
    badge: 'Final Round',
    stage: 'Interviews',
    stageIndex: 3,
    timing: 'Final review',
    description: 'You are in the final interview stage and the team is gathering closing feedback.',
    activities: ['Portfolio review completed', 'Panel interview prepared', 'Final feedback pending'],
    nextStep: 'Watch for the final decision update after the panel shares feedback.'
  },
  offer: {
    badge: 'Offer',
    stage: 'Offer',
    stageIndex: 4,
    timing: 'Offer ready',
    description: 'The hiring team is preparing or reviewing offer details for this role.',
    activities: ['Final interview completed', 'Hiring decision approved', 'Offer details being finalized'],
    nextStep: 'Review the offer details and confirm any compensation or start-date questions.'
  },
  rejected: {
    badge: 'Closed',
    stage: 'Application closed',
    stageIndex: 1,
    timing: 'No action needed',
    description: 'This application has closed, but the history remains available for your records.',
    activities: ['Application reviewed', 'Hiring team decision recorded', 'Candidate notification sent'],
    nextStep: 'You can keep exploring saved roles and apply again when a stronger match opens.'
  }
};

const statusMeta = computed(() => JOURNEY_META[props.status] || JOURNEY_META.in_review);
const currentStageIndex = computed(() => statusMeta.value.stageIndex);
const progressPercent = computed(() => (currentStageIndex.value / (stages.length - 1)) * 100);
const nextStepText = computed(() => props.nextStep || statusMeta.value.nextStep);

const closeDialog = () => {
  emit('update:visible', false);
};
</script>

<style scoped>
.journey-modal {
  background: var(--bg-default);
  border-radius: 18px;
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  color: var(--text-default);
  box-shadow: 0 24px 70px rgba(26, 40, 52, 0.22);
}

.journey-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: flex-start;
}

.journey-title-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.journey-title-block h2 {
  color: var(--text-strong);
  font-size: 28px;
  line-height: 34px;
  font-weight: 600;
}

.journey-title-block p {
  color: var(--text-default);
  font-size: 15px;
  line-height: 23px;
}

.journey-close {
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  flex: 0 0 auto;
}

.journey-role-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: #f8fafb;
}

.journey-role-title {
  color: var(--text-strong);
  font-weight: 600;
  font-size: 15px;
  line-height: 22px;
}

.journey-role-meta {
  color: var(--text-subtle);
  font-size: 13px;
  line-height: 20px;
}

.journey-status {
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.journey-status-submitted { background-color: #eef2ff; color: #4450a8; }
.journey-status-in_review { background-color: #e8f1ff; color: #1456a0; }
.journey-status-assessment { background-color: #fff4dc; color: #9a6600; }
.journey-status-interview { background-color: #d8f4f2; color: #1d3734; }
.journey-status-final_round { background-color: #f3eaff; color: #6e3fba; }
.journey-status-offer { background-color: #e3f7e8; color: #1b6b37; }
.journey-status-rejected { background-color: #f2f4f7; color: #667085; }

.journey-progress {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.journey-progress-track {
  position: relative;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: #e5e9ee;
}

.journey-progress-fill {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: inherit;
  background: var(--primary-bg);
}

.journey-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
}

.journey-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: var(--text-subtle);
  text-align: center;
}

.journey-step-marker {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-default);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--bg-default);
  font-size: 14px;
}

.journey-step-label {
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
}

.journey-step-complete,
.journey-step-current {
  color: var(--text-strong);
}

.journey-step-complete .journey-step-marker {
  border-color: var(--primary-bg);
  background: var(--primary-bg);
  color: var(--primary-text);
}

.journey-step-current .journey-step-marker {
  border: 6px solid #cfe4e1;
  background: var(--primary-bg);
}

.journey-current-panel {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 18px;
  border-radius: 12px;
  border: 1px solid #bdd5d1;
  background: linear-gradient(135deg, #f5fbfa 0%, #ffffff 72%);
}

.journey-current-copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.journey-panel-label {
  color: #ff7640;
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  text-transform: uppercase;
}

.journey-current-copy h3,
.journey-detail-panel h3 {
  color: var(--text-strong);
  font-size: 17px;
  line-height: 24px;
  font-weight: 600;
}

.journey-current-copy p,
.journey-next-panel p {
  color: var(--text-default);
  font-size: 14px;
  line-height: 22px;
}

.journey-current-stat {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-bg);
  background: #ffffff;
  border: 1px solid #d6e5e3;
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.journey-detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
}

.journey-detail-panel {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 180px;
  background: var(--bg-default);
}

.journey-panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--primary-bg);
}

.journey-activity-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.journey-activity-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: var(--text-default);
  font-size: 14px;
  line-height: 21px;
}

.journey-activity-dot {
  width: 8px;
  height: 8px;
  margin-top: 6px;
  border-radius: 999px;
  background: #ff7640;
  box-shadow: 0 0 0 4px #fff0e9;
  flex: 0 0 auto;
}

.journey-updated {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid #edf0f3;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-subtle);
  font-size: 13px;
  line-height: 18px;
}

.journey-updated strong {
  color: var(--text-strong);
  font-weight: 600;
  text-align: right;
}

.journey-footer {
  display: flex;
  justify-content: flex-end;
}

.journey-footer-btn {
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .journey-modal {
    padding: 20px;
    gap: 18px;
    border-radius: 14px;
  }

  .journey-title-block h2 {
    font-size: 24px;
    line-height: 30px;
  }

  .journey-role-summary,
  .journey-current-panel {
    flex-direction: column;
    align-items: stretch;
  }

  .journey-steps {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    row-gap: 14px;
  }

  .journey-detail-grid {
    grid-template-columns: 1fr;
  }

  .journey-current-stat {
    align-self: flex-start;
  }
}

@media (max-width: 480px) {
  .journey-modal {
    padding: 18px;
  }

  .journey-steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .journey-role-meta {
    display: flex;
    flex-direction: column;
  }
}
</style>
