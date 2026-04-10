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
                    optionLabel="searchLabel"
                    optionValue="dialCode"
                    placeholder="Code"
                    filter
                    filterPlaceholder="Search countries..."
                    class="phone-code"
                  >
                    <template #value="{ value, placeholder }">
                      <div v-if="value" class="phone-option phone-option-selected">
                        <span class="phone-flag">{{ getCountryByDialCode(value)?.flag }}</span>
                        <span>{{ value }}</span>
                      </div>
                      <span v-else>{{ placeholder }}</span>
                    </template>
                    <template #option="{ option }">
                      <div class="phone-option">
                        <span class="phone-flag">{{ option.flag }}</span>
                        <span>{{ option.name }} ({{ option.dialCode }})</span>
                      </div>
                    </template>
                  </Dropdown>
                  <InputMask id="phone" v-model="contactDraft.phone" mask="999 999 9999" placeholder="066 623 3552" class="phone-input" />
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

      <TabPanel header="Pilot Credentials">
        <div class="panel-stack">
          <section class="form-card pilot-credentials-card">
            <div class="card-heading">
              <h2>Pilot Flight Hours</h2>
              <p>Add and maintain your recent aircraft hours using the same profile workflow as the rest of this section.</p>
            </div>

            <div class="pilot-table">
              <div class="pilot-table-head">
                <div class="pilot-head-cell">Aircraft type</div>
                <div class="pilot-head-cell">Date Last Flown</div>
                <div class="pilot-head-cell">Total Fixed-Wing Turbine Time (In Hrs)</div>
                <div class="pilot-head-cell">Fixed-Wing Turbine Time in last 60 Months (In Hrs)</div>
                <div class="pilot-head-cell">Total Fixed-Wing PIC Turbine Time (In Hrs)</div>
                <div class="pilot-head-cell">Total Fixed-Wing SIC Turbine Time (In Hrs)</div>
                <div class="pilot-head-cell pilot-head-cell-actions"></div>
              </div>

              <div
                v-for="(row, index) in pilotCredentialsDraft"
                :key="row.id"
                class="pilot-table-row"
              >
                <div class="pilot-cell">
                  <Dropdown
                    v-model="row.aircraftType"
                    :options="aircraftOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Type"
                    class="pilot-field"
                  />
                </div>
                <div class="pilot-cell">
                  <Calendar
                    v-model="row.dateLastFlown"
                    dateFormat="mm/dd/yy"
                    placeholder="mm/dd/yyyy"
                    showIcon
                    iconDisplay="input"
                    class="pilot-field"
                  />
                </div>
                <div class="pilot-cell">
                  <InputText v-model="row.totalFixedWingTurbineTime" class="pilot-field" />
                </div>
                <div class="pilot-cell">
                  <InputText v-model="row.fixedWingTurbineLast60Months" class="pilot-field" />
                </div>
                <div class="pilot-cell">
                  <InputText v-model="row.totalPicTurbineTime" class="pilot-field" />
                </div>
                <div class="pilot-cell">
                  <InputText v-model="row.totalSicTurbineTime" class="pilot-field" />
                </div>
                <div class="pilot-cell pilot-cell-actions">
                  <Button
                    icon="pi pi-trash"
                    text
                    rounded
                    severity="secondary"
                    class="pilot-delete-btn"
                    :disabled="pilotCredentialsDraft.length === 1"
                    @click="removePilotCredentialRow(index)"
                  />
                </div>
              </div>

              <button type="button" class="pilot-add-row" @click="addPilotCredentialRow">
                <i class="pi pi-plus"></i>
                <span>Add Aircraft</span>
              </button>
            </div>

            <div class="actions-row pilot-actions-row">
              <Button label="Discard Changes" severity="secondary" outlined @click="resetPilotCredentials" />
              <Button label="Submit" severity="primary" class="pilot-submit-btn" @click="savePilotCredentials" />
            </div>
          </section>
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
import Calendar from 'primevue/calendar';
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
  { name: 'Ukraine', flag: '🇺🇦', dialCode: '+380', searchLabel: 'Ukraine +380' },
  { name: 'Cook Islands', flag: '🇨🇰', dialCode: '+682', searchLabel: 'Cook Islands +682' },
  { name: 'Costa Rica', flag: '🇨🇷', dialCode: '+506', searchLabel: 'Costa Rica +506' },
  { name: "Cote d'Ivoire", flag: '🇨🇮', dialCode: '+225', searchLabel: "Cote d'Ivoire +225" },
  { name: 'Croatia', flag: '🇭🇷', dialCode: '+385', searchLabel: 'Croatia +385' },
  { name: 'United States', flag: '🇺🇸', dialCode: '+1', searchLabel: 'United States +1' },
  { name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', searchLabel: 'United Kingdom +44' },
  { name: 'Germany', flag: '🇩🇪', dialCode: '+49', searchLabel: 'Germany +49' }
];

const experienceOptions = [
  { label: '0 to 3 years', value: '0_3' },
  { label: '4 to 8 years', value: '4_8' },
  { label: '8 to 14 years', value: '8_14' },
  { label: '15+ years', value: '15_plus' }
];

const aircraftOptions = [
  { label: 'A310', value: 'A310' },
  { label: 'A320', value: 'A320' },
  { label: 'A330', value: 'A330' },
  { label: 'A311', value: 'A311' },
  { label: 'B737', value: 'B737' }
];

const contactInitial = {
  firstName: 'Alex',
  lastName: 'Morgan',
  middleName: '',
  gender: null,
  email: 'alex.morgan@example.com',
  phoneCode: '+380',
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

const createPilotCredentialRow = (id, aircraftType = 'A310') => ({
  id,
  aircraftType,
  dateLastFlown: null,
  totalFixedWingTurbineTime: '0',
  fixedWingTurbineLast60Months: '0',
  totalPicTurbineTime: '0',
  totalSicTurbineTime: '0'
});

const pilotCredentialsInitial = [
  createPilotCredentialRow(1, 'A310'),
  createPilotCredentialRow(2, 'A310'),
  createPilotCredentialRow(3, 'A310')
];

const contactSaved = ref(clone(contactInitial));
const contactDraft = ref(clone(contactInitial));

const resumeSaved = ref(clone(resumeInitial));
const resumeDraft = ref(clone(resumeInitial));

const preferencesSaved = ref(clone(preferencesInitial));
const preferencesDraft = ref(clone(preferencesInitial));

const pilotCredentialsSaved = ref(clone(pilotCredentialsInitial));
const pilotCredentialsDraft = ref(clone(pilotCredentialsInitial));

const resumeInput = ref(null);
const resumeMenu = ref(null);
const nextPilotCredentialId = ref(pilotCredentialsInitial.length + 1);

const getCountryByDialCode = (dialCode) => countryCodeOptions.find((option) => option.dialCode === dialCode);

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

const addPilotCredentialRow = () => {
  pilotCredentialsDraft.value.push(createPilotCredentialRow(nextPilotCredentialId.value++, ''));
};

const removePilotCredentialRow = (index) => {
  if (pilotCredentialsDraft.value.length === 1) return;
  pilotCredentialsDraft.value.splice(index, 1);
};

const savePilotCredentials = () => {
  pilotCredentialsSaved.value = clone(pilotCredentialsDraft.value);
};

const resetPilotCredentials = () => {
  pilotCredentialsDraft.value = clone(pilotCredentialsSaved.value);
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
  align-items: stretch;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background-color: var(--bg-default);
  overflow: hidden;
}

.phone-code {
  flex: 0 0 140px;
}

.phone-input {
  flex: 1;
}

.phone-option {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 24px;
}

.phone-option-selected {
  font-size: 14px;
  color: var(--text-strong);
}

.phone-flag {
  font-size: 16px;
  line-height: 1;
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

.phone-row :deep(.p-dropdown .p-dropdown-label) {
  display: flex;
  align-items: center;
  padding: 0.875rem 0.75rem;
}

.phone-row :deep(.p-dropdown-panel .p-dropdown-items) {
  padding: 0.35rem 0;
}

.phone-row :deep(.p-dropdown-panel .p-dropdown-item) {
  padding: 0.7rem 0.85rem;
}

.phone-row :deep(.p-dropdown-panel .p-dropdown-header) {
  padding: 0.7rem;
}

.phone-row :deep(.p-dropdown-filter) {
  width: 100%;
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

.profile-page :deep(.p-tabview-panels .field label) {
  padding-top: 6px;
}

.actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 4px;
}

.pilot-credentials-card {
  border-color: var(--border-color);
}

.pilot-table {
  border: 1px solid #d1d5dc;
  background-color: #fff;
}

.pilot-table-head,
.pilot-table-row {
  display: grid;
  grid-template-columns: 1.05fr 1.1fr 1.05fr 1.15fr 1.1fr 1.1fr 72px;
}

.pilot-head-cell {
  padding: 16px 12px;
  border-right: 1px solid #d1d5dc;
  border-bottom: 1px solid #d1d5dc;
  background-color: #f4f6fa;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.25px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.7);
}

.pilot-head-cell:last-child,
.pilot-cell:last-child {
  border-right: none;
}

.pilot-table-row {
  background-color: #f8f9fb;
}

.pilot-cell {
  padding: 14px 12px;
  border-right: 1px solid #d1d5dc;
  border-bottom: 1px solid #d1d5dc;
}

.pilot-cell-actions {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pilot-field {
  width: 100%;
}

.pilot-table :deep(.p-inputtext),
.pilot-table :deep(.p-dropdown),
.pilot-table :deep(.p-calendar),
.pilot-table :deep(.p-calendar .p-inputtext) {
  width: 100%;
}

.pilot-table :deep(.p-inputtext),
.pilot-table :deep(.p-dropdown .p-dropdown-label),
.pilot-table :deep(.p-calendar .p-inputtext) {
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.25px;
  color: #637085;
}

.pilot-table :deep(.p-inputtext),
.pilot-table :deep(.p-dropdown),
.pilot-table :deep(.p-calendar .p-inputtext) {
  border-color: #d1d5dc;
  border-radius: 10px;
  min-height: 40px;
  background-color: #fff;
  box-shadow: none;
}

.pilot-table :deep(.p-dropdown .p-dropdown-label),
.pilot-table :deep(.p-calendar .p-inputtext),
.pilot-table :deep(.p-inputtext) {
  padding: 8px 16px;
}

.pilot-table :deep(.p-calendar .p-datepicker-trigger) {
  width: 40px;
  border-left: 1px solid #d1d5dc;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: #fff;
  color: #8c95a8;
}

.pilot-delete-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5dc;
  border-radius: 999px;
  color: #8c95a8;
}

.pilot-add-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 20px 40px;
  border: none;
  border-top: 0;
  background: #fff;
  color: #111b40;
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
  cursor: pointer;
}

.pilot-add-row i {
  color: #155eef;
  font-size: 18px;
}

.pilot-actions-row {
  padding-top: 28px;
}

.pilot-submit-btn {
  min-width: 140px;
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

  .pilot-table-head,
  .pilot-table-row {
    grid-template-columns: repeat(3, minmax(0, 1fr));
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

  .pilot-table {
    overflow-x: auto;
  }

  .pilot-table-head,
  .pilot-table-row {
    min-width: 980px;
    grid-template-columns: 150px 140px 150px 150px 150px 150px 72px;
  }

  .pilot-submit-btn {
    width: 100%;
  }

  .actions-row :deep(.p-button),
  .resume-file-actions :deep(.p-button) {
    width: 100%;
  }
}
</style>
