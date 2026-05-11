<script setup>
import { computed, ref, watch } from 'vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import AppIcon from './AppIcon.vue';
import InfoChip from './InfoChip.vue';
import SectionHero from './SectionHero.vue';
import { store } from '../store';

const documentJobs = computed(() => store.visibleSignDocumentJobs);
const expandedJobIds = ref(new Set());

watch(
  documentJobs,
  (jobs) => {
    expandedJobIds.value = new Set(jobs.map((job) => job.jobId));
  },
  { immediate: true }
);

const getDocumentCountLabel = (count) => `${count} document${count === 1 ? '' : 's'} to sign`;

const getDocumentActionLabel = (document) => {
  return document.status === 'signed' ? 'Review signed document' : 'Sign document';
};

const getDocumentActionUrl = (document) => {
  return document.status === 'signed' && document.signedDocumentUrl ? document.signedDocumentUrl : document.signUrl;
};

const openDocument = (document) => {
  const url = getDocumentActionUrl(document);
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const isExpanded = (jobId) => expandedJobIds.value.has(jobId);

const toggleJob = (jobId) => {
  const nextExpandedJobIds = new Set(expandedJobIds.value);
  if (nextExpandedJobIds.has(jobId)) {
    nextExpandedJobIds.delete(jobId);
  } else {
    nextExpandedJobIds.add(jobId);
  }
  expandedJobIds.value = nextExpandedJobIds;
};
</script>

<template>
  <div>
    <SectionHero
      eyebrow="Sign Documents"
      title="Complete the documents connected to your offers"
      subtitle="Review job-specific paperwork, sign pending documents, and return to signed files when you need them."
    />

    <section v-if="documentJobs.length" class="sign-documents-list" aria-label="Documents grouped by job">
      <article v-for="job in documentJobs" :key="job.jobId" class="document-job">
        <header class="document-job-header">
          <div class="document-job-main">
            <div class="document-job-heading">
              <h2 class="document-job-title ds-title-card">{{ job.jobTitle }}</h2>
              <div class="document-job-details" aria-label="Job details">
                <InfoChip icon-name="tag" :label="job.category" />
                <InfoChip icon-name="map-marker" :label="job.location" />
                <InfoChip icon-name="briefcase" :label="job.jobId" />
              </div>
            </div>

            <p class="document-job-description ds-body-sm">{{ job.description }}</p>
          </div>

          <div class="document-job-actions">
            <Tag
              :value="getDocumentCountLabel(job.documents.length)"
              class="document-count-tag"
            />
            <Button
              text
              rounded
              severity="secondary"
              class="expand-button"
              :aria-label="`${isExpanded(job.jobId) ? 'Collapse' : 'Expand'} documents for ${job.jobTitle}`"
              :aria-expanded="isExpanded(job.jobId)"
              :aria-controls="`documents-${job.jobId}`"
              @click="toggleJob(job.jobId)"
            >
              <template #icon>
                <AppIcon name="chevron-down" :class="['expand-icon', { 'expand-icon-open': isExpanded(job.jobId) }]" />
              </template>
            </Button>
          </div>
        </header>

        <div v-show="isExpanded(job.jobId)" :id="`documents-${job.jobId}`" class="document-card-list">
          <div v-for="document in job.documents" :key="document.id" class="document-card">
            <div class="document-card-icon" aria-hidden="true">
              <AppIcon name="file-text" />
            </div>

            <div class="document-card-copy">
              <div class="document-card-title-row">
                <h3 class="document-card-title ds-title-card">{{ document.title }}</h3>
                <Tag
                  :value="document.status === 'signed' ? 'Signed' : 'Signature needed'"
                  :class="['document-status', document.status === 'signed' ? 'document-status-signed' : 'document-status-pending']"
                />
              </div>
              <p class="document-card-subtitle ds-body-sm">{{ document.subtitle }}</p>
            </div>

            <div class="document-card-action">
              <Button
                :label="getDocumentActionLabel(document)"
                :severity="document.status === 'signed' ? 'secondary' : 'primary'"
                :outlined="document.status === 'signed'"
                class="document-action-button"
                @click="openDocument(document)"
              >
                <template #icon>
                  <AppIcon :name="document.status === 'signed' ? 'file-text' : 'external-link'" />
                </template>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </section>

    <div v-else class="empty-state-container">
      <div class="empty-state-content">
        <div class="icon-wrapper">
          <AppIcon name="file-text" />
        </div>
        <h2 class="empty-title">No documents to sign right now</h2>
        <p class="empty-subtitle">When a job requires a signature or has a signed document available, it will appear here.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sign-documents-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 44px;
}

.document-job {
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background-color: var(--bg-default);
  overflow: hidden;
}

.document-job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  padding: 18px;
  border-bottom: 1px solid #e7ebf0;
  background-color: var(--bg-default);
}

.document-job-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.document-job-heading {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.document-job-title,
.document-job-description,
.document-card-title,
.document-card-subtitle {
  margin: 0;
}

.document-job-description {
  max-width: 760px;
}

.document-job-details {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.document-job-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}

.document-count-tag {
  border-radius: 999px;
  padding: 4px 9px;
  background-color: #e8f1ff;
  color: #1456a0;
  font-size: 12px;
  font-weight: 600;
}

.expand-button {
  width: 2rem;
  height: 2rem;
  padding: 0;
}

.expand-icon {
  transition: transform 0.18s ease;
}

.expand-icon-open {
  transform: rotate(180deg);
}

.document-job-details :deep(.info-chip) {
  color: var(--text-strong);
}

.document-card-list {
  display: flex;
  flex-direction: column;
}

.document-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  padding: 18px 24px;
}

.document-card + .document-card {
  border-top: 1px solid #eef1f4;
}

.document-card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: #f0f7f6;
  color: var(--primary-bg);
  font-size: 22px;
}

.document-card-copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.document-card-title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.document-status {
  border-radius: 999px;
  padding: 4px 9px;
  font-size: 12px;
  font-weight: 600;
}

.document-status-pending {
  background-color: #fff4dc;
  color: #9a6600;
}

.document-status-signed {
  background-color: #e3f7e8;
  color: #1b6b37;
}

.document-card-action {
  display: flex;
  justify-content: flex-end;
}

.document-action-button {
  min-width: 190px;
  border-radius: 10px;
  padding: 9px 14px;
  font-size: 13px;
  font-weight: 500;
}

@media (max-width: 1080px) {
  .sign-documents-list {
    margin-top: 32px;
    gap: 18px;
  }

  .document-job-header {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }

  .document-job-actions {
    width: 100%;
    justify-content: space-between;
  }

  .document-card {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: start;
    padding: 18px 20px;
  }

  .document-card-action {
    grid-column: 1 / -1;
    justify-content: stretch;
  }

  .document-action-button {
    width: 100%;
  }
}

@media (max-width: 560px) {
  .document-card {
    grid-template-columns: 1fr;
  }

  .document-card-icon {
    width: 40px;
    height: 40px;
  }
}
</style>
