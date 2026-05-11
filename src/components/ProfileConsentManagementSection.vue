<template>
  <div class="panel-stack consent-panel">
    <section class="form-card consent-card">
      <div class="consent-section-header">
        <div class="card-heading consent-heading">
          <h2>Consent Management</h2>
          <p>Manage how your profile data is stored, used, and shared for job opportunities.</p>
        </div>

        <a class="consent-policy-link" href="https://example.com/privacy" target="_blank" rel="noopener noreferrer">
          View Data Privacy Policy
          <AppIcon name="external-link" />
        </a>
      </div>

      <div
        v-if="feedbackMessage"
        :class="['consent-feedback', feedbackType === 'error' ? 'consent-feedback-error' : 'consent-feedback-success']"
        role="status"
        aria-live="polite"
      >
        <AppIcon :name="feedbackType === 'error' ? 'times' : 'check'" />
        <span>{{ feedbackMessage }}</span>
      </div>

      <div v-if="expiringConsents.length" class="consent-expiry-banner" role="status" aria-live="polite">
        <AppIcon name="calendar" />
        <div>
          <strong>{{ expiringConsents[0].title }} expires soon.</strong>
          <span> Extend it to keep your profile active for future opportunities.</span>
        </div>
      </div>

      <div v-if="isLoading" class="consent-loading" role="status" aria-live="polite">
        <span class="consent-spinner" aria-hidden="true"></span>
        <span>Loading consent preferences from CRM...</span>
      </div>

      <div v-else-if="hasLoadError" class="consent-load-error" role="alert">
        <div>
          <h3>Consent preferences could not be loaded</h3>
          <p>We could not retrieve the latest CRM values. Try again before making changes.</p>
        </div>
        <Button label="Retry" severity="secondary" outlined @click="onRetryLoad" />
      </div>

      <div v-else class="consent-groups">
        <section v-for="group in groupedConsents" :key="group.title" class="consent-group" :aria-labelledby="group.headingId">
          <div class="consent-group-heading">
            <h3 :id="group.headingId">{{ group.title }}</h3>
          </div>

          <div class="consent-list">
            <article v-for="consent in group.items" :key="consent.id" class="consent-row">
              <div class="consent-row-main">
                <div class="consent-title-row">
                  <h4>{{ consent.title }}</h4>
                  <Tag :value="getStatusLabel(consent)" :class="['consent-status-tag', consent.agreed ? 'consent-status-agreed' : 'consent-status-not-agreed']" />
                </div>

                <p>{{ consent.description }}</p>

                <div v-if="consent.expiresSoon" class="consent-expiry-note">
                  <AppIcon name="calendar" />
                  <span>Expires {{ consent.expiryDate }}. {{ consent.expiryCountdown }}</span>
                  <Button label="Extend consent" severity="secondary" text class="consent-link-button" @click="extendConsent(consent.id)" />
                </div>
              </div>

              <div class="consent-row-actions">
                <div class="consent-choice" :aria-label="`${consent.title} consent preference`">
                  <button
                    type="button"
                    class="consent-choice-button"
                    :class="{ 'consent-choice-button-active': consent.agreed === true }"
                    :aria-pressed="consent.agreed === true"
                    :aria-label="`Agree to ${consent.title}`"
                    @click="requestConsentChange(consent, true)"
                  >
                    Agreed
                  </button>
                  <button
                    type="button"
                    class="consent-choice-button"
                    :class="{ 'consent-choice-button-active consent-choice-button-negative': consent.agreed === false }"
                    :aria-pressed="consent.agreed === false"
                    :aria-label="`Withdraw or decline ${consent.title}`"
                    @click="requestConsentChange(consent, false)"
                  >
                    Not agreed
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </section>

    <div class="actions-row consent-actions-row">
      <Button label="Discard Changes" severity="secondary" outlined :disabled="!hasChanges || isSaving" @click="onDiscard" />
      <Button label="Save" severity="primary" :disabled="!hasChanges || isSaving" :loading="isSaving" @click="onSave" />
    </div>

    <Dialog
      v-model:visible="isWithdrawalDialogVisible"
      modal
      header="Withdraw data retention consent?"
      :style="{ width: 'min(520px, calc(100vw - 32px))' }"
      :breakpoints="{ '640px': 'calc(100vw - 32px)' }"
    >
      <p class="withdrawal-dialog-text">
        Withdrawing this consent may affect profile storage, recruiter visibility, future job recommendations, and access to some Candidate Hub features.
      </p>
      <template #footer>
        <Button label="Cancel" severity="secondary" outlined @click="cancelWithdrawal" />
        <Button label="Withdraw consent" severity="primary" @click="confirmWithdrawal" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import AppIcon from './AppIcon.vue';

const props = defineProps({
  consentDraft: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  hasLoadError: {
    type: Boolean,
    default: false
  },
  isSaving: {
    type: Boolean,
    default: false
  },
  feedbackMessage: {
    type: String,
    default: ''
  },
  feedbackType: {
    type: String,
    default: 'success'
  },
  hasChanges: {
    type: Boolean,
    default: false
  },
  onRetryLoad: {
    type: Function,
    required: true
  },
  onSave: {
    type: Function,
    required: true
  },
  onDiscard: {
    type: Function,
    required: true
  }
});

const isWithdrawalDialogVisible = ref(false);
const pendingWithdrawalConsentId = ref(null);

const groupedConsents = computed(() => [
  {
    title: 'Profile data',
    headingId: 'consent-profile-data',
    items: props.consentDraft.filter((consent) => consent.group === 'profile')
  },
  {
    title: 'Communication preferences',
    headingId: 'consent-communication',
    items: props.consentDraft.filter((consent) => consent.group === 'communication')
  },
  {
    title: 'AI preferences',
    headingId: 'consent-ai',
    items: props.consentDraft.filter((consent) => consent.group === 'ai')
  }
]);

const expiringConsents = computed(() => props.consentDraft.filter((consent) => consent.expiresSoon && consent.agreed));

const getStatusLabel = (consent) => {
  if (consent.agreed === true) return 'Agreed';
  if (consent.agreed === false) return 'Not agreed';
  return 'Consent not provided';
};

const findConsent = (id) => props.consentDraft.find((consent) => consent.id === id);

const setConsentValue = (id, agreed) => {
  const consent = findConsent(id);
  if (!consent) return;
  consent.agreed = agreed;
};

const requestConsentChange = (consent, agreed) => {
  if (consent.id === 'dataRetention' && agreed === false && consent.agreed !== false) {
    pendingWithdrawalConsentId.value = consent.id;
    isWithdrawalDialogVisible.value = true;
    return;
  }
  setConsentValue(consent.id, agreed);
};

const confirmWithdrawal = () => {
  if (pendingWithdrawalConsentId.value) {
    setConsentValue(pendingWithdrawalConsentId.value, false);
  }
  cancelWithdrawal();
};

const cancelWithdrawal = () => {
  isWithdrawalDialogVisible.value = false;
  pendingWithdrawalConsentId.value = null;
};

const extendConsent = (id) => {
  const consent = findConsent(id);
  if (!consent) return;
  consent.agreed = true;
  consent.expiresSoon = false;
  consent.expiryDate = 'May 11, 2027';
  consent.expiryCountdown = 'Renewed for 12 months';
};
</script>

<style scoped>
.consent-panel {
  gap: 20px;
}

.consent-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.consent-section-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: flex-start;
}

.consent-heading {
  margin-bottom: 0;
}

.consent-policy-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  color: var(--secondary-text);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

.consent-policy-link:hover {
  color: var(--primary-bg);
  text-decoration: underline;
}

.consent-feedback,
.consent-expiry-banner,
.consent-loading,
.consent-load-error {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 16px;
  border-radius: 12px;
}

.consent-feedback-success {
  border: 1px solid #c9ead3;
  background: #f0fbf3;
  color: #1b6b37;
}

.consent-feedback-error,
.consent-load-error {
  border: 1px solid #f2c6c6;
  background: #fff5f5;
  color: #9b1c1c;
}

.consent-expiry-banner {
  border: 1px solid #f3d59a;
  background: #fff8e8;
  color: #6f4a00;
}

.consent-loading {
  align-items: center;
  border: 1px solid var(--border-color);
  background: #fbfcfd;
  color: var(--text-default);
}

.consent-load-error {
  justify-content: space-between;
  align-items: center;
}

.consent-load-error h3,
.consent-load-error p {
  margin: 0;
}

.consent-load-error h3 {
  font-size: 16px;
  color: #7f1d1d;
}

.consent-load-error p {
  margin-top: 4px;
  font-size: 14px;
  line-height: 22px;
}

.consent-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5dc;
  border-top-color: var(--primary-bg);
  border-radius: 999px;
  animation: consent-spin 0.8s linear infinite;
}

.consent-groups {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.consent-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.consent-group-heading h3 {
  margin: 0;
  color: var(--text-strong);
  font-size: 15px;
  line-height: 22px;
  font-weight: 600;
}

.consent-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  overflow: hidden;
}

.consent-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 20px;
  align-items: center;
  padding: 18px;
  background: #fff;
}

.consent-row + .consent-row {
  border-top: 1px solid #eef1f4;
}

.consent-row-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.consent-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.consent-title-row h4 {
  margin: 0;
  color: var(--text-strong);
  font-size: var(--type-title-card-size);
  line-height: var(--type-title-card-line);
  font-weight: 600;
}

.consent-row-main p {
  margin: 0;
  max-width: 800px;
  color: var(--text-default);
  font-size: 14px;
  line-height: 22px;
}

.consent-status-tag {
  border-radius: 999px;
  padding: 4px 9px;
  font-size: 12px;
  font-weight: 600;
}

.consent-status-agreed {
  background: #e3f7e8;
  color: #1b6b37;
}

.consent-status-not-agreed {
  background: #f2f4f7;
  color: #667085;
}

.consent-expiry-note {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: #6f4a00;
  font-size: 13px;
  line-height: 20px;
}

.consent-link-button {
  min-height: 28px;
  padding: 2px 4px;
  color: var(--secondary-text);
  font-size: 13px;
  font-weight: 600;
}

.consent-row-actions {
  display: flex;
  justify-content: flex-end;
}

.consent-choice {
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  min-width: 232px;
  padding: 4px;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: #f6f8fb;
}

.consent-choice-button {
  min-height: 36px;
  padding: 7px 12px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--text-subtle);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
}

.consent-choice-button-active {
  background: #fff;
  color: var(--primary-bg);
  box-shadow: 0 1px 3px rgba(16, 24, 40, 0.12);
}

.consent-choice-button-negative {
  color: var(--text-strong);
}

.consent-choice-button:focus-visible,
.consent-policy-link:focus-visible {
  outline: 3px solid #0f766e;
  outline-offset: 3px;
}

.consent-actions-row :deep(.p-button) {
  min-width: 140px;
}

.withdrawal-dialog-text {
  margin: 0;
  color: var(--text-default);
  font-size: 15px;
  line-height: 24px;
}

@keyframes consent-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .consent-spinner {
    animation: none;
  }
}

@media (max-width: 900px) {
  .consent-section-header,
  .consent-load-error,
  .consent-row {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: stretch;
  }

  .consent-policy-link {
    white-space: normal;
  }

  .consent-row-actions {
    justify-content: stretch;
  }

  .consent-choice {
    width: 100%;
  }
}

@media (max-width: 560px) {
  .consent-choice {
    grid-template-columns: 1fr;
    border-radius: 12px;
  }

  .consent-choice-button {
    border-radius: 10px;
  }
}
</style>
