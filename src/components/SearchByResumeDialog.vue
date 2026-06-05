<template>
  <Dialog
    :visible="visible"
    modal
    :closable="false"
    :draggable="false"
    :style="{ width: 'min(calc(100% - 32px), 44rem)' }"
    class="search-resume-dialog"
    @update:visible="emit('update:visible', $event)"
  >
    <template #container>
      <div class="search-resume-modal">
        <div class="search-resume-header">
          <h2>Find better job matches with your resume</h2>
          <button type="button" class="search-resume-close" aria-label="Close dialog" @click="closeDialog">
            <AppIcon name="times" />
          </button>
        </div>

        <div class="search-resume-body">
          <p class="search-resume-intro">
            Your resume helps us recommend jobs that match your skills and experience.
          </p>

          <div
            class="search-resume-dropzone"
            :class="{ 'search-resume-dropzone-active': isDragging, 'search-resume-dropzone-has-file': selectedFile }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
          >
            <template v-if="selectedFile">
              <div class="search-resume-file-preview">
                <div class="search-resume-file-icon-wrap">
                  <i class="pi pi-file"></i>
                </div>
                <div class="search-resume-file-meta">
                  <strong>{{ selectedFile.name }}</strong>
                  <span>{{ formatFileSize(selectedFile.size) }}</span>
                </div>
                <button type="button" class="search-resume-file-remove" aria-label="Remove selected file" @click.stop="clearFile">
                  <AppIcon name="times" />
                </button>
              </div>
            </template>

            <template v-else>
              <div class="search-resume-upload-icon-wrap" aria-hidden="true">
                <i class="pi pi-upload"></i>
              </div>
              <p class="search-resume-dropzone-text">
                Drop resume file here or
                <button type="button" class="search-resume-link" @click.stop="openPicker">select a file to upload</button>
              </p>
              <p class="search-resume-dropzone-hint">
                All .pdf, .doc, .docx, .txt types are supported, up to 1MB
              </p>
            </template>
          </div>

          <input ref="fileInput" type="file" class="hidden-input" accept=".pdf,.doc,.docx,.txt" @change="onFilePicked" />

          <p v-if="errorMessage" class="search-resume-error" role="alert">{{ errorMessage }}</p>

          <div class="search-resume-consent">
            <Checkbox v-model="hasAcceptedTerms" inputId="search-resume-consent" :binary="true" />
            <label for="search-resume-consent">
              I have read and accept the
              <a href="#" @click.prevent>privacy policy</a>
              and
              <a href="#" @click.prevent>terms of use</a>
              <span class="search-resume-required" aria-hidden="true">*</span>
            </label>
          </div>
        </div>

        <div class="search-resume-footer">
          <Button label="Cancel" severity="secondary" outlined class="search-resume-btn-cancel" @click="closeDialog" />
          <Button
            label="Get My Matches"
            severity="primary"
            class="search-resume-btn-submit"
            :disabled="!canSubmit"
            @click="submitSearch"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import AppIcon from './AppIcon.vue';

const MAX_FILE_SIZE = 1024 * 1024;
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];
const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt'];

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'submit']);

const fileInput = ref(null);
const selectedFile = ref(null);
const isDragging = ref(false);
const errorMessage = ref('');
const hasAcceptedTerms = ref(false);

const canSubmit = computed(() => Boolean(selectedFile.value) && hasAcceptedTerms.value);

const resetState = () => {
  selectedFile.value = null;
  isDragging.value = false;
  errorMessage.value = '';
  hasAcceptedTerms.value = false;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

watch(
  () => props.visible,
  (isVisible) => {
    if (!isVisible) resetState();
  }
);

const closeDialog = () => {
  emit('update:visible', false);
};

const openPicker = () => {
  fileInput.value?.click();
};

const isAcceptedFile = (file) => {
  if (!file) return false;
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  return ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(extension);
};

const setFile = (file) => {
  errorMessage.value = '';

  if (!file) return;

  if (!isAcceptedFile(file)) {
    errorMessage.value = 'Please upload a PDF, DOC, DOCX, or TXT file.';
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    errorMessage.value = 'File size must be 1 MB or less.';
    return;
  }

  selectedFile.value = file;
};

const onFilePicked = (event) => {
  setFile(event.target.files?.[0]);
  event.target.value = '';
};

const onDrop = (event) => {
  isDragging.value = false;
  setFile(event.dataTransfer?.files?.[0]);
};

const clearFile = () => {
  selectedFile.value = null;
  errorMessage.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const submitSearch = () => {
  if (!canSubmit.value) return;
  emit('submit', selectedFile.value);
  closeDialog();
};
</script>

<style scoped>
.search-resume-modal {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background: #fff;
  overflow: hidden;
}

.search-resume-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 24px 28px;
  border-bottom: 1px solid #e5e7eb;
}

.search-resume-header h2 {
  margin: 0;
  font-size: 20px;
  line-height: 30px;
  font-weight: 600;
  color: #111827;
}

.search-resume-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #374151;
  cursor: pointer;
  flex-shrink: 0;
}

.search-resume-close:hover {
  background: #f3f4f6;
}

.search-resume-close:focus-visible {
  outline: 3px solid #0f766e;
  outline-offset: 2px;
}

.search-resume-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 28px 28px;
}

.search-resume-intro {
  margin: 0;
  font-size: 15px;
  line-height: 24px;
  color: #4b5563;
}

.search-resume-dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 260px;
  padding: 40px 32px;
  border: 1px dashed #d1d5dc;
  border-radius: 12px;
  background: #fff;
  text-align: center;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.search-resume-dropzone-active {
  border-color: rgba(60, 109, 104, 0.45);
  background: #f9fbfa;
}

.search-resume-dropzone-has-file {
  cursor: default;
}

.search-resume-upload-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: #f3f4f6;
  color: #111827;
}

.search-resume-upload-icon-wrap i {
  font-size: 18px;
}

.search-resume-dropzone-text {
  margin: 0;
  font-size: 15px;
  line-height: 24px;
  color: #374151;
}

.search-resume-link {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--secondary-text);
  font: inherit;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
}

.search-resume-link:hover {
  color: var(--primary-bg);
}

.search-resume-dropzone-hint {
  margin: 0;
  font-size: 13px;
  line-height: 20px;
  color: #6b7280;
}

.search-resume-file-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 420px;
  padding: 16px 18px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: #f9fbfd;
  text-align: left;
}

.search-resume-file-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: #f3f4f6;
  flex-shrink: 0;
}

.search-resume-file-icon-wrap i {
  font-size: 18px;
  color: #374151;
}

.search-resume-file-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.search-resume-file-meta strong {
  color: var(--text-strong);
  font-size: 15px;
  word-break: break-word;
}

.search-resume-file-meta span {
  font-size: 13px;
  color: var(--text-subtle);
}

.search-resume-file-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #374151;
  cursor: pointer;
  flex-shrink: 0;
}

.search-resume-file-remove:hover {
  background: #f3f4f6;
}

.search-resume-error {
  margin: -8px 0 0;
  font-size: 13px;
  line-height: 20px;
  color: #b42318;
}

.search-resume-consent {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 22px;
  color: #374151;
}

.search-resume-consent label {
  cursor: pointer;
}

.search-resume-consent a {
  color: var(--secondary-text);
  text-decoration: underline;
}

.search-resume-consent a:hover {
  color: var(--primary-bg);
}

.search-resume-required {
  color: var(--secondary-text);
}

.hidden-input {
  display: none;
}

.search-resume-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 20px 28px 24px;
  border-top: 1px solid #e5e7eb;
}

.search-resume-btn-cancel,
.search-resume-btn-submit {
  min-height: 42px;
  padding: 10px 24px !important;
  border-radius: 999px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
}

.search-resume-btn-cancel {
  color: var(--secondary-text) !important;
  border-color: #8c95a8 !important;
}

@media (max-width: 640px) {
  .search-resume-header,
  .search-resume-body,
  .search-resume-footer {
    padding-left: 20px;
    padding-right: 20px;
  }

  .search-resume-dropzone {
    min-height: 220px;
    padding: 28px 20px;
  }

  .search-resume-footer {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .search-resume-footer :deep(.p-button) {
    width: 100%;
  }
}
</style>
