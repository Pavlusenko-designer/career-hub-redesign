<template>
  <Dialog
    :visible="visible"
    modal
    :closable="false"
    :draggable="false"
    :style="{ width: 'min(calc(100% - 32px), 36rem)' }"
    class="upload-resume-dialog"
    @update:visible="emit('update:visible', $event)"
  >
    <template #container>
      <div class="upload-modal">
        <div class="upload-modal-header">
          <h2>Upload your resume</h2>
          <button type="button" class="upload-modal-close" aria-label="Close upload dialog" @click="closeDialog">
            <AppIcon name="times" />
          </button>
        </div>

        <div class="upload-modal-body">
          <p class="upload-modal-intro">We'll use it to match you with relevant roles and speed up applications.</p>

          <div
            class="upload-dropzone"
            :class="{ 'upload-dropzone-active': isDragging, 'upload-dropzone-has-file': selectedFile }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
            @click="openPicker"
          >
            <template v-if="selectedFile">
              <div class="upload-file-preview">
                <div class="upload-file-icon">
                  <i class="pi pi-file-pdf"></i>
                </div>
                <div class="upload-file-meta">
                  <strong>{{ selectedFile.name }}</strong>
                  <span>{{ formatFileSize(selectedFile.size) }}</span>
                </div>
                <button
                  type="button"
                  class="upload-file-remove"
                  aria-label="Remove selected file"
                  @click.stop="clearFile"
                >
                  <AppIcon name="times" />
                </button>
              </div>
            </template>

            <template v-else>
              <i class="pi pi-file-arrow-up upload-dropzone-icon"></i>
              <h3>Drag and drop your resume here</h3>
              <p>PDF, DOC, or DOCX up to 5 MB</p>
              <Button label="Choose file" icon="pi pi-upload" severity="secondary" outlined @click.stop="openPicker" />
            </template>
          </div>

          <input ref="fileInput" type="file" class="hidden-input" accept=".pdf,.doc,.docx" @change="onFilePicked" />

          <p v-if="errorMessage" class="upload-error" role="alert">{{ errorMessage }}</p>
        </div>

        <div class="upload-modal-footer">
          <Button label="Cancel" text class="upload-modal-btn-cancel" @click="closeDialog" />
          <Button label="Upload" severity="primary" class="upload-modal-btn-confirm" :disabled="!selectedFile" @click="submitUpload" />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import AppIcon from './AppIcon.vue';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'upload']);

const fileInput = ref(null);
const selectedFile = ref(null);
const isDragging = ref(false);
const errorMessage = ref('');

const resetState = () => {
  selectedFile.value = null;
  isDragging.value = false;
  errorMessage.value = '';
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
    errorMessage.value = 'Please upload a PDF, DOC, or DOCX file.';
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    errorMessage.value = 'File size must be 5 MB or less.';
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

const submitUpload = () => {
  if (!selectedFile.value) return;
  emit('upload', selectedFile.value);
  closeDialog();
};
</script>

<style scoped>
.upload-modal {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background: #fff;
  overflow: hidden;
}

.upload-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.upload-modal-header h2 {
  margin: 0;
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
  color: #374151;
}

.upload-modal-close {
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
}

.upload-modal-close:hover {
  background: #f3f4f6;
}

.upload-modal-close:focus-visible {
  outline: 3px solid #0f766e;
  outline-offset: 2px;
}

.upload-modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.upload-modal-intro {
  margin: 0;
  font-size: 15px;
  line-height: 24px;
  color: #4b5563;
}

.upload-dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 200px;
  padding: 28px 24px;
  border: 1px dashed var(--border-color);
  border-radius: 12px;
  background: #fbfcfd;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.upload-dropzone:hover,
.upload-dropzone-active {
  border-color: rgba(60, 109, 104, 0.45);
  background: #f7faf9;
}

.upload-dropzone-has-file {
  cursor: default;
}

.upload-dropzone-icon {
  font-size: 28px;
  color: var(--primary-bg);
}

.upload-dropzone h3 {
  margin: 0;
  font-size: 16px;
  color: var(--text-strong);
}

.upload-dropzone p {
  margin: 0;
  font-size: 14px;
  color: var(--text-subtle);
}

.upload-file-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 16px 18px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: #f9fbfd;
  text-align: left;
}

.upload-file-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #eef3f8;
  flex-shrink: 0;
}

.upload-file-icon i {
  font-size: 20px;
  color: var(--primary-bg);
}

.upload-file-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.upload-file-meta strong {
  color: var(--text-strong);
  font-size: 15px;
  word-break: break-word;
}

.upload-file-meta span {
  font-size: 13px;
  color: var(--text-subtle);
}

.upload-file-remove {
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

.upload-file-remove:hover {
  background: #f3f4f6;
}

.upload-error {
  margin: 0;
  font-size: 13px;
  line-height: 20px;
  color: #b42318;
}

.hidden-input {
  display: none;
}

.upload-modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
}

.upload-modal-btn-cancel {
  min-height: 40px;
  padding: 8px 16px !important;
  color: #374151 !important;
  font-size: 15px !important;
  font-weight: 500 !important;
}

.upload-modal-btn-cancel:hover {
  background: #f3f4f6 !important;
}

.upload-modal-btn-confirm {
  min-height: 40px;
  padding: 8px 24px !important;
  border-radius: 999px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
}

@media (max-width: 560px) {
  .upload-modal-header,
  .upload-modal-body,
  .upload-modal-footer {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
