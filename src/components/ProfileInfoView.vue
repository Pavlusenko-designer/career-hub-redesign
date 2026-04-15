<template>
  <section class="profile-page">
    <SectionHero
      eyebrow="Profile Information"
      title="Keep your profile up to date"
      subtitle="Manage your personal details, resume, and job preferences so applications are faster and recommendations stay relevant."
    />

    <TabView
      class="profile-tabs"
      :activeIndex="profileTabIndex"
      scrollable
      @tab-change="onProfileTabChange"
    >
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
                    aria-label="Country calling code"
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
              <fieldset class="field-group">
                <legend id="experience-range">Relevant years of experience</legend>
              <SelectButton
                aria-labelledby="experience-range"
                v-model="preferencesDraft.experienceRange"
                :options="experienceOptions"
                optionLabel="label"
                optionValue="value"
                class="experience-select"
              />
              </fieldset>
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

      <TabPanel header="Availability">
        <div class="panel-stack">
          <section class="availability-shell">
            <div class="availability-card">
              <div class="availability-content">
                <div class="availability-header">
                  <div class="availability-title-row">
                    <h2>My Availability</h2>
                  </div>
                  <p>Keep your availability up-to-date to get matched with the best jobs.</p>
                </div>

                <fieldset class="availability-section availability-group">
                  <legend id="availability-months-label" class="availability-label">Which months are you available to work?</legend>
                  <SelectButton
                    v-model="availabilityDraft.months"
                    :options="monthOptions"
                    multiple
                    unselectable
                    aria-labelledby="availability-months-label"
                    class="availability-select availability-select-months"
                  />
                </fieldset>

                <div class="availability-divider"></div>

                <div class="availability-section availability-section-compact">
                  <div class="availability-field availability-field-short">
                    <label for="days-per-week">How many days of the week are you available?</label>
                    <InputText
                      id="days-per-week"
                      :model-value="availabilityDraft.daysPerWeek"
                      type="number"
                      min="0"
                      max="7"
                      step="1"
                      inputmode="numeric"
                      placeholder="0"
                      class="availability-native-number availability-field-short"
                      @update:model-value="availabilityDraft.daysPerWeek = normalizeNumberInput($event, 0, 7)"
                    />
                    <small>Max. 7 days per week</small>
                  </div>
                </div>

                <fieldset class="availability-section availability-section-days availability-group">
                  <legend id="availability-days-label" class="availability-label">Select days of the week you are available</legend>
                  <div class="availability-select-row availability-select-row-split">
                    <SelectButton
                      v-model="availabilityDraft.days"
                      :options="fullWeekPrimary"
                      multiple
                      unselectable
                      aria-labelledby="availability-days-label"
                      class="availability-select availability-select-days availability-select-4"
                    />
                    <span class="availability-inline-divider" aria-hidden="true"></span>
                    <SelectButton
                      v-model="availabilityDraft.days"
                      :options="fullWeekWeekend"
                      multiple
                      unselectable
                      aria-labelledby="availability-days-label"
                      class="availability-select availability-select-days availability-select-3"
                    />
                  </div>
                </fieldset>

                <div class="availability-divider"></div>

                <fieldset class="availability-section availability-section-days availability-group">
                  <legend id="availability-weekdays-label" class="availability-label">Select weekdays you are available</legend>
                  <SelectButton
                    v-model="availabilityDraft.weekdays"
                    :options="weekdayOptions"
                    multiple
                    unselectable
                    aria-labelledby="availability-weekdays-label"
                    class="availability-select availability-select-days availability-select-4"
                  />
                </fieldset>

                <div class="availability-divider"></div>

                <div class="availability-section availability-section-compact">
                  <div class="availability-field availability-field-short">
                    <label for="weekend-days">How many weekends are you available? (Friday-Sunday)</label>
                    <InputText
                      id="weekend-days"
                      :model-value="availabilityDraft.weekendDaysCount"
                      type="number"
                      min="0"
                      max="3"
                      step="1"
                      inputmode="numeric"
                      placeholder="0"
                      class="availability-native-number availability-field-short"
                      @update:model-value="availabilityDraft.weekendDaysCount = normalizeNumberInput($event, 0, 3)"
                    />
                    <small>Max. 3 weekend days</small>
                  </div>
                </div>

                <fieldset class="availability-section availability-section-days availability-group">
                  <legend id="availability-weekend-days-label" class="availability-label">Select weekend days you are available</legend>
                  <SelectButton
                    v-model="availabilityDraft.weekendDays"
                    :options="weekendOptions"
                    multiple
                    unselectable
                    aria-labelledby="availability-weekend-days-label"
                    class="availability-select availability-select-days availability-select-3"
                  />
                </fieldset>

                <div class="availability-divider"></div>

                <div class="availability-section availability-section-compact">
                  <div class="availability-field">
                    <label for="hours-per-week">How many hours a week are you willing to work?</label>
                    <InputText
                      id="hours-per-week"
                      :model-value="availabilityDraft.hoursPerWeek"
                      type="number"
                      min="0"
                      max="60"
                      step="1"
                      inputmode="numeric"
                      placeholder="0"
                      class="availability-native-number availability-native-number-wide"
                      @update:model-value="availabilityDraft.hoursPerWeek = normalizeNumberInput($event, 0, 60)"
                    />
                    <small>Max. 60 hours per week</small>
                  </div>
                </div>

                <div class="availability-divider"></div>

                <fieldset class="availability-section availability-group">
                  <legend class="availability-label">Are you available to work on public holidays?</legend>
                  <div class="availability-radio-row">
                    <div class="availability-radio-item">
                      <RadioButton v-model="availabilityDraft.publicHolidays" inputId="public-holidays-yes" name="publicHolidays" :value="true" />
                      <label for="public-holidays-yes">Yes</label>
                    </div>
                    <div class="availability-radio-item">
                      <RadioButton v-model="availabilityDraft.publicHolidays" inputId="public-holidays-no" name="publicHolidays" :value="false" />
                      <label for="public-holidays-no">No</label>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>

            <div class="availability-footer">
              <Button
                severity="secondary"
                outlined
                class="availability-clear-btn"
                @click="clearAvailability"
              >
                <span class="availability-clear-content">
                  <svg class="availability-clear-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M9 3.75h6a.75.75 0 0 1 .75.75v1.5H19.5a.75.75 0 0 1 0 1.5h-.69l-.63 10.114A2.25 2.25 0 0 1 15.934 20.25H8.066a2.25 2.25 0 0 1-2.245-2.136L5.19 7.5H4.5a.75.75 0 0 1 0-1.5h3.75V4.5A.75.75 0 0 1 9 3.75Zm5.25 2.25v-.75h-4.5V6h4.5Zm-6.928 1.5.595 10.021a.75.75 0 0 0 .749.729h7.868a.75.75 0 0 0 .749-.729l.595-10.02H7.322Zm2.553 2.25a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 .75-.75Zm4.5 0a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 .75-.75Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>Clear Availability</span>
                </span>
              </Button>

              <div class="availability-footer-actions">
                <Button label="Discard Changes" severity="secondary" outlined @click="resetAvailability" />
                <Button label="Save" severity="primary" @click="saveAvailability" />
              </div>
            </div>
          </section>
        </div>
      </TabPanel>

      <TabPanel header="Pilot Credentials">
        <div class="panel-stack">
          <section class="form-card pilot-credentials-card">
            <div class="card-heading">
              <h2>Pilot Flight Hours</h2>
              <p>Add and maintain your recent aircraft hours using the same profile workflow as the rest of this section.</p>
            </div>

            <div class="pilot-table" role="table" aria-label="Pilot flight hours">
              <div class="pilot-table-head" role="rowgroup">
                <div class="pilot-head-cell" role="columnheader">Aircraft type</div>
                <div class="pilot-head-cell" role="columnheader">Date Last Flown</div>
                <div class="pilot-head-cell" role="columnheader">Total Fixed-Wing Turbine Time (In Hrs)</div>
                <div class="pilot-head-cell" role="columnheader">Fixed-Wing Turbine Time in last 60 Months (In Hrs)</div>
                <div class="pilot-head-cell" role="columnheader">Total Fixed-Wing PIC Turbine Time (In Hrs)</div>
                <div class="pilot-head-cell" role="columnheader">Total Fixed-Wing SIC Turbine Time (In Hrs)</div>
                <div class="pilot-head-cell pilot-head-cell-actions" role="columnheader">Actions</div>
              </div>

              <div
                v-for="(row, index) in pilotCredentialsDraft"
                :key="row.id"
                class="pilot-table-row"
                role="row"
              >
                <div class="pilot-cell" role="cell">
                  <Dropdown
                    v-model="row.aircraftType"
                    :options="aircraftOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Type"
                    class="pilot-field"
                  />
                </div>
                <div class="pilot-cell" role="cell">
                  <Calendar
                    v-model="row.dateLastFlown"
                    dateFormat="mm/dd/yy"
                    placeholder="mm/dd/yyyy"
                    showIcon
                    iconDisplay="input"
                    class="pilot-field"
                  />
                </div>
                <div class="pilot-cell" role="cell">
                  <InputText v-model="row.totalFixedWingTurbineTime" class="pilot-field" />
                </div>
                <div class="pilot-cell" role="cell">
                  <InputText v-model="row.fixedWingTurbineLast60Months" class="pilot-field" />
                </div>
                <div class="pilot-cell" role="cell">
                  <InputText v-model="row.totalPicTurbineTime" class="pilot-field" />
                </div>
                <div class="pilot-cell" role="cell">
                  <InputText v-model="row.totalSicTurbineTime" class="pilot-field" />
                </div>
                <div class="pilot-cell pilot-cell-actions" role="cell">
                  <Button
                    icon="pi pi-trash"
                    text
                    rounded
                    severity="secondary"
                    class="pilot-delete-btn"
                    :aria-label="`Remove aircraft row ${index + 1}`"
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
import { ref, watch } from 'vue';
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
import RadioButton from 'primevue/radiobutton';
import SelectButton from 'primevue/selectbutton';
import SectionHero from './SectionHero.vue';

const clone = (value) => JSON.parse(JSON.stringify(value));

const monthOptions = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'December',
  'November'
];

const fullWeekPrimary = ['Mon', 'Tue', 'Wed', 'Thu'];
const fullWeekWeekend = ['Fri', 'Sat', 'Sun'];
const weekdayOptions = ['Mon', 'Tue', 'Wed', 'Thu'];
const weekendOptions = ['Fri', 'Sat', 'Sun'];

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

const availabilityInitial = {
  months: ['March', 'April', 'May', 'June', 'September', 'October'],
  daysPerWeek: null,
  days: ['Tue', 'Thu', 'Fri'],
  weekdays: ['Tue'],
  weekendDaysCount: null,
  weekendDays: ['Sun'],
  hoursPerWeek: null,
  publicHolidays: false
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

const availabilitySaved = ref(clone(availabilityInitial));
const availabilityDraft = ref(clone(availabilityInitial));

const pilotCredentialsSaved = ref(clone(pilotCredentialsInitial));
const pilotCredentialsDraft = ref(clone(pilotCredentialsInitial));

const profileTabIndex = ref(0);
const resumeInput = ref(null);
const resumeMenu = ref(null);
const nextPilotCredentialId = ref(pilotCredentialsInitial.length + 1);

const onProfileTabChange = (event) => {
  profileTabIndex.value = event.index;
};

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

const resetAvailability = () => {
  availabilityDraft.value = clone(availabilitySaved.value);
};

const saveAvailability = () => {
  availabilitySaved.value = clone(availabilityDraft.value);
};

const clearAvailability = () => {
  availabilityDraft.value = {
    months: [],
    daysPerWeek: null,
    days: [],
    weekdays: [],
    weekendDaysCount: null,
    weekendDays: [],
    hoursPerWeek: null,
    publicHolidays: null
  };
};

const toggleAvailabilityItem = (collection, item) => {
  const index = collection.indexOf(item);

  if (index >= 0) {
    collection.splice(index, 1);
    return;
  }

  collection.push(item);
};

const toggleLimitedSelection = (collection, item, limit) => {
  const index = collection.indexOf(item);

  if (index >= 0) {
    collection.splice(index, 1);
    return;
  }

  if (limit && collection.length >= limit) return;
  collection.push(item);
};

const normalizeNumberInput = (value, min, max) => {
  if (value === '' || value === null || value === undefined) return null;

  const parsed = Number(value);
  if (Number.isNaN(parsed)) return null;

  return Math.min(max, Math.max(min, Math.trunc(parsed)));
};

const trimCollectionToLimit = (collection, limit) => {
  if (limit == null) return;
  if (limit <= 0) {
    collection.splice(0, collection.length);
    return;
  }

  if (collection.length > limit) {
    collection.splice(limit);
  }
};

watch(
  () => availabilityDraft.value.daysPerWeek,
  (limit) => {
    trimCollectionToLimit(availabilityDraft.value.days, limit);
  }
);

watch(
  () => [...availabilityDraft.value.days],
  (selection) => {
    const limit = availabilityDraft.value.daysPerWeek;
    if (limit == null || selection.length <= limit) return;
    availabilityDraft.value.days = selection.slice(0, limit);
  }
);

watch(
  () => availabilityDraft.value.weekendDaysCount,
  (limit) => {
    trimCollectionToLimit(availabilityDraft.value.weekendDays, limit);
  }
);

watch(
  () => [...availabilityDraft.value.weekendDays],
  (selection) => {
    const limit = availabilityDraft.value.weekendDaysCount;
    if (limit == null || selection.length <= limit) return;
    availabilityDraft.value.weekendDays = selection.slice(0, limit);
  }
);

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
  gap: 40px;
}

.profile-tabs :deep(.p-tabview-nav-container) {
  border-radius: 16px;
  border: 1px solid var(--border-color);
  background: linear-gradient(180deg, #ffffff 0%, #f8fbfc 100%);
}

.profile-tabs :deep(.p-tabview-nav) {
  gap: 6px;
  padding: 8px;
  border: none;
  background: transparent;
}

.profile-tabs :deep(.p-tabview-nav li) {
  margin: 0;
  flex: 0 0 auto;
}

.profile-tabs :deep(.p-tabview-nav li .p-tabview-nav-link) {
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: var(--text-subtle);
  white-space: nowrap;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.profile-tabs :deep(.p-tabview-nav li .p-tabview-nav-link:hover) {
  background-color: #f3f7f8;
  color: var(--text-strong);
}

.profile-tabs :deep(.p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  border-color: rgba(60, 109, 104, 0.2);
  background-color: rgba(60, 109, 104, 0.08);
  color: var(--text-strong);
}

.panel-stack {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 24px;
}

/* Remove PrimeVue's default panel padding — cards own their spacing */
.profile-page :deep(.p-tabview-panels) {
  padding: 0;
}

.form-card {
  padding: 28px;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background-color: var(--bg-default);
}

.card-heading {
  margin-bottom: 16px;
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

.field-group,
.availability-group {
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
}

.field-group legend,
.availability-group legend {
  padding: 0;
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

.availability-shell {
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}

.availability-card {
  padding: 32px;
  background: #fff;
}

.availability-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.availability-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.availability-title-row {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.availability-title-row h2 {
  margin: 0 0 4px;
  font-size: 20px;
  line-height: var(--type-title-section-line);
  font-weight: 600;
  color: var(--text-strong);
}

.availability-header p {
  margin: 0;
  font-size: 14px;
  line-height: 22px;
  color: var(--text-subtle);
}

.availability-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.availability-section-compact,
.availability-section-days {
  gap: 8px;
}

.availability-label,
.availability-field label {
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  color: var(--text-strong);
}

.availability-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.availability-field-short {
  max-width: 280px;
}

.availability-field small {
  font-size: 12px;
  line-height: 16px;
  color: var(--text-subtle);
}

.availability-select-row {
  display: grid;
  gap: 8px;
}

.availability-select-row-split {
  grid-template-columns: minmax(0, 4fr) 16px minmax(0, 3fr);
  align-items: center;
}

.availability-inline-divider {
  display: block;
  width: 1px;
  height: 32px;
  justify-self: center;
  background: rgba(0, 0, 0, 0.12);
}

.availability-select {
  width: 100%;
}

.availability-shell :deep(.availability-select.p-selectbutton) {
  display: grid;
  gap: 8px;
}

.availability-shell :deep(.availability-select-months.p-selectbutton) {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.availability-shell :deep(.availability-select-4.p-selectbutton) {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.availability-shell :deep(.availability-select-3.p-selectbutton) {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.availability-shell :deep(.availability-select .p-button) {
  justify-content: center;
  min-height: 32px;
  margin: 0;
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: #fff;
  font-size: 14px;
  line-height: 24px;
  color: #637085;
  box-shadow: none;
}

.availability-shell :deep(.availability-select .p-button:not(.p-highlight):hover) {
  border-color: #8c95a8;
  background: #fff;
  color: #637085;
}

.availability-shell :deep(.availability-select .p-button.p-highlight) {
  border-color: var(--primary-bg);
  background: rgba(60, 109, 104, 0.08);
  color: var(--text-strong);
}

.availability-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.08);
}

.availability-dropdown {
  width: 100%;
}

.availability-shell :deep(.p-dropdown) {
  border-color: #8c95a8;
  border-radius: 10px;
  min-height: 42px;
  box-shadow: none;
}

.availability-shell :deep(.p-dropdown .p-dropdown-label) {
  padding: 10px 12px;
  font-size: var(--type-body-sm-size);
  line-height: var(--type-body-sm-line);
  color: var(--text-subtle);
}

.availability-shell :deep(.p-dropdown .p-dropdown-trigger) {
  width: 2.5rem;
  color: #637085;
}

.availability-native-number {
  width: 100%;
}

.availability-native-number-wide {
  max-width: none;
}

.availability-shell :deep(.availability-native-number.p-inputtext) {
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid #8c95a8;
  border-radius: 10px;
  box-shadow: none;
  font-size: 14px;
  line-height: 20px;
  color: var(--text-strong);
}

.availability-shell :deep(.availability-native-number.p-inputtext::placeholder) {
  color: #637085;
}

.availability-radio-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.availability-radio-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.availability-radio-item label {
  font-size: 14px;
  line-height: 24px;
  color: var(--text-strong);
  cursor: pointer;
}

.availability-shell :deep(.p-radiobutton .p-radiobutton-box) {
  width: 18px;
  height: 18px;
  border-width: 2px;
  border-color: #8c95a8;
  box-shadow: none;
}

.availability-shell :deep(.p-radiobutton .p-radiobutton-box.p-highlight) {
  border-color: var(--primary-bg);
  background: #fff;
}

.availability-shell :deep(.p-radiobutton .p-radiobutton-box .p-radiobutton-icon) {
  background-color: var(--primary-bg);
  width: 8px;
  height: 8px;
}

.availability-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  background: #fcfcfc;
  box-shadow: 0 4px 6px rgba(69, 69, 69, 0.1);
}

.availability-footer-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.availability-footer :deep(.p-button) {
  min-height: 44px;
  border-radius: 999px;
  padding: 10px 20px;
}

.availability-clear-content {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.availability-clear-icon {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
}

.availability-footer :deep(.p-button.p-button-outlined),
.availability-footer :deep(.p-button.p-button-secondary) {
  border-color: #bdbdbd;
  color: #777;
}

.availability-footer :deep(.p-button.p-button-primary) {
  border-color: #bdbdbd !important;
  background: #f2f2f2 !important;
  color: #777 !important;
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

  .availability-shell :deep(.availability-select-months.p-selectbutton) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .availability-shell :deep(.availability-select-4.p-selectbutton),
  .availability-shell :deep(.availability-select-3.p-selectbutton) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .availability-select-row-split {
    grid-template-columns: 1fr;
  }

  .availability-inline-divider {
    display: none;
  }

  .pilot-table-head,
  .pilot-table-row {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .profile-page {
    gap: 28px;
  }

  .profile-tabs :deep(.p-tabview-nav-container) {
    border-radius: 14px;
  }

  .profile-tabs :deep(.p-tabview-nav) {
    padding: 8px;
  }

  .profile-tabs :deep(.p-tabview-nav-btn) {
    width: 2.25rem;
    color: var(--text-subtle);
  }

  .profile-tabs :deep(.p-tabview-nav li .p-tabview-nav-link) {
    padding: 0.75rem 0.95rem;
    font-size: 13px;
  }

  .panel-stack {
    gap: 24px;
    padding-top: 16px;
  }

  .form-card {
    padding: 16px;
    border-radius: 12px;
  }

  .availability-card {
    padding: 16px;
  }

  .card-heading {
    margin-bottom: 16px;
  }

  .form-grid-4,
  .form-grid-2,
  .availability-select-row-split {
    grid-template-columns: 1fr;
  }

  .availability-shell :deep(.availability-select-months.p-selectbutton) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .availability-shell :deep(.availability-select-4.p-selectbutton),
  .availability-shell :deep(.availability-select-3.p-selectbutton) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .phone-row {
    flex-direction: column;
  }

  .phone-code {
    flex-basis: auto;
  }

  .resume-file-card,
  .resume-file-actions,
  .actions-row,
  .availability-footer,
  .availability-footer-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .availability-header p {
    font-size: 14px;
  }

  .availability-field-short {
    max-width: none;
  }

  .availability-footer {
    padding: 16px;
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
  .resume-file-actions :deep(.p-button),
  .availability-footer :deep(.p-button) {
    width: 100%;
  }
}
</style>
