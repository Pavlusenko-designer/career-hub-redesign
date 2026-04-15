<template>
  <div class="panel-stack">
    <section class="form-card">
      <div class="card-heading">
        <h2>Uploaded Resume</h2>
        <p>Use your resume to speed up applications and help us understand your background.</p>
      </div>

      <div v-if="resumeDraft.fileName" class="resume-file-card">
        <div class="resume-file-icon">
          <i class="pi pi-file-pdf"></i>
        </div>
        <div class="resume-file-meta">
          <span class="resume-file-label">Last uploaded</span>
          <strong>{{ resumeDraft.fileName }}</strong>
          <span>{{ resumeDraft.lastUploaded }}</span>
        </div>
        <div class="resume-file-actions">
          <Button icon="pi pi-chevron-down" severity="secondary" outlined aria-label="Resume actions" @click="toggleResumeMenu" />
          <Menu ref="resumeMenu" :model="resumeMenuItems" :popup="true" />
        </div>
      </div>

      <div v-else class="resume-dropzone" @dragover.prevent @drop.prevent="onResumeDrop">
        <i class="pi pi-file-arrow-up resume-dropzone-icon"></i>
        <h3>Drag and drop your resume here</h3>
        <p>PDF, DOC, or DOCX up to 5 MB</p>
        <Button label="Choose File" icon="pi pi-upload" severity="secondary" outlined @click="openResumePicker" />
      </div>

      <input ref="resumeInput" type="file" class="hidden-input" accept=".pdf,.doc,.docx" @change="onResumePicked" />

      <div class="checkbox-row resume-attach-row">
        <Checkbox v-model="resumeDraft.attachDuringApplication" inputId="attach-resume" :binary="true" />
        <label for="attach-resume">Attach this document automatically when I apply</label>
      </div>
    </section>

    <section class="form-card">
      <div class="card-heading">
        <h2>Skills From Resume</h2>
        <p>Review parsed skills and add anything that should also be included on your profile.</p>
      </div>

      <div class="field">
        <label for="skills">Skills</label>
        <Chips id="skills" v-model="resumeDraft.skills" separator="," addOnBlur />
      </div>
    </section>

    <div class="actions-row">
      <Button label="Discard Changes" severity="secondary" outlined @click="onReset" />
      <Button label="Save" severity="primary" @click="onSave" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Chips from 'primevue/chips';
import Menu from 'primevue/menu';

const props = defineProps({
  resumeDraft: Object,
  onReset: Function,
  onSave: Function
});

const resumeMenu = ref(null);
const resumeInput = ref(null);

const openResumePicker = () => {
  resumeInput.value?.click();
};

const setResumeFile = (file) => {
  if (!file) return;
  props.resumeDraft.fileName = file.name;
  props.resumeDraft.lastUploaded = 'Uploaded just now';
};

const onResumePicked = (event) => {
  const file = event.target.files?.[0];
  setResumeFile(file);
  event.target.value = '';
};

const onResumeDrop = (event) => {
  const file = event.dataTransfer?.files?.[0];
  setResumeFile(file);
};

const removeResume = () => {
  props.resumeDraft.fileName = '';
  props.resumeDraft.lastUploaded = '';
  props.resumeDraft.attachDuringApplication = false;
};

const toggleResumeMenu = (event) => {
  resumeMenu.value?.toggle(event);
};

const resumeMenuItems = [
  { label: 'Replace resume', icon: 'pi pi-upload', command: () => openResumePicker() },
  { label: 'Remove resume', icon: 'pi pi-trash', command: () => removeResume() }
];
</script>
