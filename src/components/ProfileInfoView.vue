<template>
  <section class="profile-page">
    <SectionHero
      eyebrow="Profile Information"
      title="Keep your profile up to date"
      subtitle="Manage your personal details, resume, and job preferences so applications are faster and recommendations stay relevant."
    />

    <TabView class="profile-tabs">
      <TabPanel header="Contact Information">
        <div class="panel-stack">
          <section class="form-card">
            <div class="card-heading">
              <h2>Personal Details</h2>
              <p>These details are used on your candidate profile and across applications.</p>
            </div>

            <div class="form-grid form-grid-4">
              <div class="field">
                <label for="first-name">First name</label>
                <InputText id="first-name" v-model="contactDraft.firstName" />
              </div>
              <div class="field">
                <label for="last-name">Last name</label>
                <InputText id="last-name" v-model="contactDraft.lastName" />
              </div>
              <div class="field">
                <label for="middle-name">Middle name</label>
                <InputText id="middle-name" v-model="contactDraft.middleName" />
              </div>
              <div class="field">
                <label for="gender">Gender <span class="optional">Optional</span></label>
                <Dropdown
                  id="gender"
                  v-model="contactDraft.gender"
                  :options="genderOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select if you'd like"
                  showClear
                />
              </div>
            </div>
          </section>

          <section class="form-card">
            <div class="card-heading">
              <h2>Contact Details</h2>
              <p>Your email is fixed to your account. Phone number can be updated anytime.</p>
            </div>

            <div class="form-grid form-grid-2">
              <div class="field">
                <label for="email">Email</label>
                <InputText id="email" v-model="contactDraft.email" readonly />
              </div>
              <div class="field">
                <label for="phone">Phone number</label>
                <div class="phone-row">
                  <Dropdown
                    id="phone-code"
                    v-model="contactDraft.phoneCode"
                    :options="countryCodeOptions"
                    optionLabel="label"
                    optionValue="value"
                    class="phone-code"
                  />
                  <InputMask id="phone" v-model="contactDraft.phone" mask="999 999 9999" placeholder="000 000 0000" class="phone-input" />
                </div>
              </div>
            </div>
          </section>

          <div class="actions-row">
            <Button label="Discard Changes" severity="secondary" outlined @click="resetContact" />
            <Button label="Save" severity="primary" @click="saveContact" />
          </div>
        </div>
      </TabPanel>

      <TabPanel header="Resume">
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
            <Button label="Discard Changes" severity="secondary" outlined @click="resetResume" />
            <Button label="Save" severity="primary" @click="saveResume" />
          </div>
        </div>
      </TabPanel>

      <TabPanel header="Preferences">
        <div class="panel-stack">
          <section class="form-card">
            <div class="card-heading">
              <h2>Career Preferences</h2>
              <p>These preferences help tailor the opportunities and recommendations you see.</p>
            </div>

            <div class="field">
              <label for="job-categories">Preferred job categories</label>
              <Chips id="job-categories" v-model="preferencesDraft.jobCategories" separator="," addOnBlur />
            </div>

            <div class="form-grid form-grid-2">
              <div class="field">
                <label for="job-location">Preferred job location</label>
                <InputText id="job-location" v-model="preferencesDraft.location" />
              </div>
              <div class="field">
                <label for="recent-title">Most recent job title</label>
                <InputText id="recent-title" v-model="preferencesDraft.recentTitle" />
              </div>
            </div>

            <div class="field preferences-experience-field">
              <label for="experience-range">Relevant years of experience</label>
              <SelectButton
                id="experience-range"
                v-model="preferencesDraft.experienceRange"
                :options="experienceOptions"
                optionLabel="label"
                optionValue="value"
                class="experience-select"
              />
              <div class="checkbox-row checkbox-row-plain career-start-row">
                <Checkbox v-model="preferencesDraft.startingCareer" inputId="starting-career" :binary="true" />
                <label for="starting-career">Just starting my career</label>
              </div>
            </div>
          </section>

          <div class="actions-row">
            <Button label="Discard Changes" severity="secondary" outlined @click="resetPreferences" />
            <Button label="Save" severity="primary" @click="savePreferences" />
          </div>
        </div>
      </TabPanel>
    </TabView>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import InputMask from 'primevue/inputmask';
import Checkbox from 'primevue/checkbox';
import Chips from 'primevue/chips';
import Menu from 'primevue/menu';
import SelectButton from 'primevue/selectbutton';
import SectionHero from './SectionHero.vue';

const clone = (value) => JSON.parse(JSON.stringify(value));

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'I prefer not to disclose', value: 'prefer_not_to_disclose' }
];

const countryCodeOptions = [
  { label: '+38', value: '+38' },
  { label: '+1', value: '+1' },
  { label: '+44', value: '+44' },
  { label: '+49', value: '+49' }
];

const experienceOptions = [
  { label: '0 to 3 years', value: '0_3' },
  { label: '4 to 8 years', value: '4_8' },
  { label: '8 to 14 years', value: '8_14' },
  { label: '15+ years', value: '15_plus' }
];

const contactInitial = {
  firstName: 'Alex',
  lastName: 'Morgan',
  middleName: '',
  gender: null,
  email: 'alex.morgan@example.com',
  phoneCode: '+38',
  phone: '067 555 1234'
};

const resumeInitial = {
  fileName: 'alex-morgan-resume.pdf',
  lastUploaded: 'Uploaded Mar 20, 2026',
  attachDuringApplication: true,
  skills: ['Product design', 'Design systems', 'Figma', 'User research']
};

const preferencesInitial = {
  jobCategories: ['Product Design', 'Design Systems'],
  location: 'Remote, Europe',
  recentTitle: 'Senior Product Designer',
  experienceRange: '4_8',
  startingCareer: false
};

const contactSaved = ref(clone(contactInitial));
const contactDraft = ref(clone(contactInitial));

const resumeSaved = ref(clone(resumeInitial));
const resumeDraft = ref(clone(resumeInitial));

const preferencesSaved = ref(clone(preferencesInitial));
const preferencesDraft = ref(clone(preferencesInitial));

const resumeInput = ref(null);
const resumeMenu = ref(null);

const resetContact = () => {
  contactDraft.value = clone(contactSaved.value);
};

const saveContact = () => {
  contactSaved.value = clone(contactDraft.value);
};

const resetResume = () => {
  resumeDraft.value = clone(resumeSaved.value);
};

const saveResume = () => {
  resumeSaved.value = clone(resumeDraft.value);
};

const resetPreferences = () => {
  preferencesDraft.value = clone(preferencesSaved.value);
};

const savePreferences = () => {
  preferencesSaved.value = clone(preferencesDraft.value);
};

const openResumePicker = () => {
  resumeInput.value?.click();
};

const toggleResumeMenu = (event) => {
  resumeMenu.value?.toggle(event);
};

const setResumeFile = (file) => {
  if (!file) return;

  resumeDraft.value.fileName = file.name;
  resumeDraft.value.lastUploaded = 'Uploaded just now';
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
  resumeDraft.value.fileName = '';
  resumeDraft.value.lastUploaded = '';
  resumeDraft.value.attachDuringApplication = false;
};

const resumeMenuItems = [
  {
    label: 'Replace resume',
    icon: 'pi pi-upload',
    command: () => openResumePicker()
  },
  {
    label: 'Remove resume',
    icon: 'pi pi-trash',
    command: () => removeResume()
  }
];
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel-stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 12px;
}

.form-card {
  padding: 28px;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background-color: var(--bg-default);
}

.card-heading {
  margin-bottom: 24px;
}

.card-heading h2 {
  margin: 0 0 4px;
  font-size: 20px;
  color: var(--text-strong);
}

.card-heading p {
  margin: 0;
  font-size: 14px;
  line-height: 22px;
  color: var(--text-subtle);
}

.form-grid {
  display: grid;
  gap: 20px;
}

.form-grid-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.form-grid-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-strong);
}

.optional {
  color: var(--text-subtle);
  font-weight: 400;
}

.field :deep(.p-inputtext),
.field :deep(.p-dropdown),
.field :deep(.p-inputmask),
.field :deep(.p-chips),
.field :deep(.p-selectbutton) {
  width: 100%;
}

.field :deep(.p-inputtext[readonly]) {
  background-color: #f7f9fc;
  color: var(--text-subtle);
}

.phone-row {
  display: flex;
  gap: 12px;
  align-items: stretch;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background-color: var(--bg-default);
  overflow: hidden;
}

.phone-code {
  flex: 0 0 116px;
}

.phone-input {
  flex: 1;
}

.phone-row :deep(.p-dropdown),
.phone-row :deep(.p-inputtext),
.phone-row :deep(.p-inputmask) {
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

.phone-row :deep(.p-dropdown) {
  border-right: 1px solid var(--border-color) !important;
  background-color: #f9fbfd;
}

.phone-row :deep(.p-dropdown:not(.p-disabled):hover),
.phone-row :deep(.p-inputtext:hover) {
  border-color: transparent !important;
}

.phone-row :deep(.p-focus),
.phone-row :deep(.p-inputtext:focus) {
  box-shadow: none !important;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--text-default);
}

.resume-attach-row {
  margin-top: 20px;
  padding-top: 4px;
}

.checkbox-row-plain {
  min-height: 44px;
}

.preferences-experience-field {
  gap: 14px;
}

.career-start-row {
  margin-top: 2px;
}

.actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 4px;
}

.resume-file-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 20px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background-color: #f9fbfd;
}

.resume-file-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background-color: #eef3f8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.resume-file-icon i {
  font-size: 20px;
  color: var(--primary-bg);
}

.resume-file-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.resume-file-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-subtle);
}

.resume-file-meta strong {
  color: var(--text-strong);
}

.resume-file-meta span:last-child {
  font-size: 14px;
  color: var(--text-subtle);
}

.resume-file-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.resume-dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px 24px;
  border: 1px dashed var(--border-color);
  border-radius: 16px;
  background-color: #fbfcfd;
  text-align: center;
  margin-bottom: 24px;
}

.resume-dropzone h3 {
  margin: 0;
  font-size: 20px;
  color: var(--text-strong);
}

.resume-dropzone p {
  margin: 0;
  font-size: 14px;
  color: var(--text-subtle);
}

.resume-dropzone-icon {
  font-size: 28px;
  color: var(--primary-bg);
}

.hidden-input {
  display: none;
}

.field :deep(.p-chips .p-chips-multiple-container) {
  gap: 8px;
  padding: 8px 10px;
}

.field :deep(.p-chips-token) {
  margin: 0;
}

.field :deep(.p-selectbutton) {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.field :deep(.p-selectbutton .p-button) {
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-default);
  color: var(--text-strong);
  padding: 10px 14px;
  flex: 0 0 auto;
}

.field :deep(.p-selectbutton .p-button.p-highlight) {
  background-color: var(--primary-bg);
  border-color: var(--primary-bg);
  color: #fff;
}

@media (max-width: 1024px) {
  .form-grid-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .form-card {
    padding: 20px;
  }

  .form-grid-4,
  .form-grid-2 {
    grid-template-columns: 1fr;
  }

  .phone-row {
    flex-direction: column;
  }

  .phone-code {
    flex-basis: auto;
  }

  .resume-file-card,
  .resume-file-actions,
  .actions-row {
    flex-direction: column;
    align-items: stretch;
  }

  .actions-row :deep(.p-button),
  .resume-file-actions :deep(.p-button) {
    width: 100%;
  }
}
</style>
