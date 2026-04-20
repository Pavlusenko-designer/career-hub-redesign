<script setup>
import { onBeforeUnmount, onMounted, ref, watch, computed } from 'vue';
import Menu from 'primevue/menu';
import AppIcon from './AppIcon.vue';
import SectionHero from './SectionHero.vue';
import ProfileContactSection from './ProfileContactSection.vue';
import ProfileResumeSection from './ProfileResumeSection.vue';
import ProfilePreferencesSection from './ProfilePreferencesSection.vue';
import ProfileAvailabilitySection from './ProfileAvailabilitySection.vue';
import ProfilePilotCredentialsSection from './ProfilePilotCredentialsSection.vue';

const clone = (value) => JSON.parse(JSON.stringify(value));

const monthOptions = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'December', 'November'
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
const isProfileMobile = ref(false);
const NAV_BREAKPOINT = 940;

const profileTabItems = [
  { label: 'Contact Information' },
  { label: 'Resume' },
  { label: 'Preferences' },
  { label: 'Availability' },
  { label: 'Pilot Credentials' }
];

const visibleProfileTabs = computed(() => {
  if (!isProfileMobile.value) return profileTabItems;
  return profileTabItems.slice(0, 2);
});

const moreProfileMenuItems = computed(() => {
  if (!isProfileMobile.value) return [];
  return profileTabItems.slice(2).map((item, index) => ({
    label: item.label,
    command: () => {
      profileTabIndex.value = index + 2;
    }
  }));
});

const moreProfileMenu = ref(null);
const toggleMoreProfileMenu = (event) => {
  moreProfileMenu.value.toggle(event);
};

const syncViewport = () => {
  isProfileMobile.value = window.innerWidth <= NAV_BREAKPOINT;
};

const onProfileTabChange = (index) => {
  profileTabIndex.value = index;
};

const getCountryByDialCode = (dialCode) => countryCodeOptions.find((option) => option.dialCode === dialCode);
const resetContact = () => { contactDraft.value = clone(contactSaved.value); };
const saveContact = () => { contactSaved.value = clone(contactDraft.value); };
const resetResume = () => { resumeDraft.value = clone(resumeSaved.value); };
const saveResume = () => { resumeSaved.value = clone(resumeDraft.value); };
const resetPreferences = () => { preferencesDraft.value = clone(preferencesSaved.value); };
const savePreferences = () => { preferencesSaved.value = clone(preferencesDraft.value); };
const resetAvailability = () => { availabilityDraft.value = clone(availabilitySaved.value); };
const saveAvailability = () => { availabilitySaved.value = clone(availabilityDraft.value); };

const clearAvailability = () => {
  availabilityDraft.value = {
    months: [], daysPerWeek: null, days: [], weekdays: [],
    weekendDaysCount: null, weekendDays: [], hoursPerWeek: null, publicHolidays: null
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

watch(() => availabilityDraft.value.daysPerWeek, (limit) => {
  trimCollectionToLimit(availabilityDraft.value.days, limit);
});

watch(() => [...availabilityDraft.value.days], (selection) => {
  const limit = availabilityDraft.value.daysPerWeek;
  if (limit == null || selection.length <= limit) return;
  availabilityDraft.value.days = selection.slice(0, limit);
});

watch(() => availabilityDraft.value.weekendDaysCount, (limit) => {
  trimCollectionToLimit(availabilityDraft.value.weekendDays, limit);
});

watch(() => [...availabilityDraft.value.weekendDays], (selection) => {
  const limit = availabilityDraft.value.weekendDaysCount;
  if (limit == null || selection.length <= limit) return;
  availabilityDraft.value.weekendDays = selection.slice(0, limit);
});

const nextPilotCredentialId = ref(pilotCredentialsInitial.length + 1);
const addPilotCredentialRow = () => {
  pilotCredentialsDraft.value.push(createPilotCredentialRow(nextPilotCredentialId.value++, ''));
};
const removePilotCredentialRow = (index) => {
  if (pilotCredentialsDraft.value.length === 1) return;
  pilotCredentialsDraft.value.splice(index, 1);
};
const savePilotCredentials = () => { pilotCredentialsSaved.value = clone(pilotCredentialsDraft.value); };
const resetPilotCredentials = () => { pilotCredentialsDraft.value = clone(pilotCredentialsSaved.value); };

onMounted(() => {
  syncViewport();
  window.addEventListener('resize', syncViewport);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncViewport);
});
</script>

<template>
  <section class="profile-page">
    <SectionHero
      eyebrow="Profile Information"
      title="Keep your profile up to date"
      subtitle="Manage your personal details, resume, and job preferences so applications are faster and recommendations stay relevant."
    />

    <div class="profile-nav-area">
      <nav class="profile-nav" aria-label="Profile sections">
        <div class="profile-nav-scroll">
          <button
            v-for="(item, index) in visibleProfileTabs"
            :key="item.label"
            type="button"
            class="profile-nav-tab"
            :class="{ 'profile-nav-tab-active': profileTabIndex === index }"
            @click="onProfileTabChange(index)"
          >
            <span class="profile-nav-tab-label">{{ item.label }}</span>
          </button>
          
          <template v-if="isProfileMobile && moreProfileMenuItems.length > 0">
            <button
              type="button"
              class="profile-nav-tab"
              :class="{ 'profile-nav-tab-active': profileTabIndex >= 2 }"
              @click="toggleMoreProfileMenu"
              aria-haspopup="true"
              aria-controls="profile_more_menu"
            >
              <span class="profile-nav-tab-label">More</span>
              <AppIcon name="chevron-down" style="font-size: 14px; margin-left: 4px; color: inherit;" />
            </button>
            <Menu ref="moreProfileMenu" id="profile_more_menu" :model="moreProfileMenuItems" :popup="true" />
          </template>
        </div>
      </nav>
    </div>

    <div class="profile-content">
      <div v-if="profileTabIndex === 0" class="profile-panel">
        <ProfileContactSection
          :contact-draft="contactDraft"
          :gender-options="genderOptions"
          :country-code-options="countryCodeOptions"
          :get-country-by-dial-code="getCountryByDialCode"
          :on-reset="resetContact"
          :on-save="saveContact"
        />
      </div>
      <div v-if="profileTabIndex === 1" class="profile-panel">
        <ProfileResumeSection :resume-draft="resumeDraft" :on-reset="resetResume" :on-save="saveResume" />
      </div>
      <div v-if="profileTabIndex === 2" class="profile-panel">
        <ProfilePreferencesSection :preferences-draft="preferencesDraft" :experience-options="experienceOptions" :on-reset="resetPreferences" :on-save="savePreferences" />
      </div>
      <div v-if="profileTabIndex === 3" class="profile-panel">
        <ProfileAvailabilitySection
          :availability-draft="availabilityDraft"
          :month-options="monthOptions"
          :full-week-primary="fullWeekPrimary"
          :full-week-weekend="fullWeekWeekend"
          :weekday-options="weekdayOptions"
          :weekend-options="weekendOptions"
          :normalize-number-input="normalizeNumberInput"
          :on-clear="clearAvailability"
          :on-reset="resetAvailability"
          :on-save="saveAvailability"
        />
      </div>
      <div v-if="profileTabIndex === 4" class="profile-panel">
        <ProfilePilotCredentialsSection
          :pilot-credentials-draft="pilotCredentialsDraft"
          :aircraft-options="aircraftOptions"
          :on-add="addPilotCredentialRow"
          :on-remove="removePilotCredentialRow"
          :on-reset="resetPilotCredentials"
          :on-save="savePilotCredentials"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.profile-nav-area {
  margin-bottom: 32px;
  border-bottom: 1px solid var(--border-color);
}

.profile-nav-scroll {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding: 8px 0;
  scrollbar-width: none;
}

.profile-nav-scroll::-webkit-scrollbar {
  display: none;
}

.profile-nav-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0.75rem 1.25rem;
  background: #fff;
  color: var(--text-subtle);
  border: 1px solid var(--border-color);
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
}

.profile-nav-tab:hover {
  color: var(--text-strong);
  background-color: #f6f8fb;
  border-color: var(--border-color-strong);
}

.profile-nav-tab-active {
  color: var(--text-strong);
  background-color: #f7faf9;
  border-color: rgba(60, 109, 104, 0.34);
  font-weight: 600;
}

.profile-content {
  margin-top: 0;
}

@media (max-width: 940px) {
  .profile-nav-area {
    position: sticky;
    top: 56px;
    z-index: 20;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    margin-left: -16px;
    margin-right: -16px;
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>

<style>
/* Global styles for the Profile sections, prefixed with .profile-page to scope them */
.profile-page .panel-stack {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 24px;
}

.profile-page .form-card {
  padding: 28px;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background-color: var(--bg-default);
}

.profile-page .card-heading {
  margin-bottom: 16px;
}

.profile-page .card-heading h2 {
  margin: 0 0 4px;
  font-size: 20px;
  color: var(--text-strong);
}

.profile-page .card-heading p {
  margin: 0;
  font-size: 14px;
  line-height: 22px;
  color: var(--text-subtle);
}

.profile-page .form-grid {
  display: grid;
  gap: 20px;
}

.profile-page .form-grid-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.profile-page .form-grid-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.profile-page .field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.profile-page .field label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-strong);
}

.profile-page .optional {
  color: var(--text-subtle);
  font-weight: 400;
}

.profile-page .field .p-inputtext,
.profile-page .field .p-dropdown,
.profile-page .field .p-inputmask,
.profile-page .field .p-chips,
.profile-page .field .p-selectbutton {
  width: 100%;
}

.profile-page .phone-row {
  display: flex;
  align-items: stretch;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background-color: var(--bg-default);
  overflow: hidden;
}

.profile-page .phone-code {
  flex: 0 0 140px;
}

.profile-page .phone-input {
  flex: 1;
}

.profile-page .phone-option {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 24px;
}

.profile-page .phone-option-selected {
  font-size: 14px;
  color: var(--text-strong);
}

.profile-page .phone-flag {
  font-size: 16px;
  line-height: 1;
}

.profile-page .checkbox-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--text-default);
}

.profile-page .resume-attach-row {
  margin-top: 20px;
  padding-top: 4px;
}

.profile-page .checkbox-row-plain {
  min-height: 44px;
}

.profile-page .preferences-experience-field {
  gap: 14px;
}

.profile-page .career-start-row {
  margin-top: 2px;
}

.profile-page .field-group,
.profile-page .availability-group {
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
}

.profile-page .field-group legend,
.profile-page .availability-group legend {
  padding: 0;
}

.profile-page .actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 4px;
}

.profile-page .availability-shell {
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}

.profile-page .availability-card {
  padding: 32px;
  background: #fff;
}

.profile-page .availability-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-page .availability-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-page .availability-title-row {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.profile-page .availability-title-row h2 {
  margin: 0 0 4px;
  font-size: 20px;
  line-height: var(--type-title-section-line);
  font-weight: 600;
  color: var(--text-strong);
}

.profile-page .availability-header p {
  margin: 0;
  font-size: 14px;
  line-height: 22px;
  color: var(--text-subtle);
}

.profile-page .availability-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-page .availability-section-compact,
.profile-page .availability-section-days {
  gap: 8px;
}

.profile-page .availability-label,
.profile-page .availability-field label {
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  color: var(--text-strong);
}

.profile-page .availability-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-page .availability-field-short {
  max-width: 280px;
}

.profile-page .availability-field small {
  font-size: 12px;
  line-height: 16px;
  color: var(--text-subtle);
}

.profile-page .availability-select-row {
  display: grid;
  gap: 8px;
}

.profile-page .availability-select-row-split {
  grid-template-columns: minmax(0, 4fr) 16px minmax(0, 3fr);
  align-items: center;
}

.profile-page .availability-inline-divider {
  display: block;
  width: 1px;
  height: 32px;
  justify-self: center;
  background: rgba(0, 0, 0, 0.12);
}

.profile-page .availability-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.08);
}

.profile-page .availability-radio-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.profile-page .availability-radio-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.profile-page .availability-radio-item label {
  font-size: 14px;
  line-height: 24px;
  color: var(--text-strong);
  cursor: pointer;
}

.profile-page .availability-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  background: #fcfcfc;
  box-shadow: 0 4px 6px rgba(69, 69, 69, 0.1);
}

.profile-page .availability-footer-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile-page .availability-clear-content {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.profile-page .availability-clear-icon {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
}

.profile-page .pilot-credentials-card {
  border-color: var(--border-color);
}

.profile-page .pilot-table {
  border: 1px solid #d1d5dc;
  background-color: #fff;
}

.profile-page .pilot-table-head,
.profile-page .pilot-table-row {
  display: grid;
  grid-template-columns: 1.05fr 1.1fr 1.05fr 1.15fr 1.1fr 1.1fr 72px;
}

.profile-page .pilot-head-cell {
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

.profile-page .pilot-head-cell:last-child,
.profile-page .pilot-cell:last-child {
  border-right: none;
}

.profile-page .pilot-table-row {
  background-color: #f8f9fb;
}

.profile-page .pilot-cell {
  padding: 14px 12px;
  border-right: 1px solid #d1d5dc;
  border-bottom: 1px solid #d1d5dc;
}

.profile-page .pilot-cell-actions {
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-page .pilot-field {
  width: 100%;
}

.profile-page .pilot-delete-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5dc;
  border-radius: 999px;
  color: #8c95a8;
}

.profile-page .pilot-add-row {
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

.profile-page .pilot-add-row i {
  color: #155eef;
  font-size: 18px;
}

.profile-page .pilot-actions-row {
  padding-top: 28px;
}

.profile-page .pilot-submit-btn {
  min-width: 140px;
}

.profile-page .resume-file-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 20px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  background-color: #f9fbfd;
}

.profile-page .resume-file-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background-color: #eef3f8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-page .resume-file-icon i {
  font-size: 20px;
  color: var(--primary-bg);
}

.profile-page .resume-file-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.profile-page .resume-file-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-subtle);
}

.profile-page .resume-file-meta strong {
  color: var(--text-strong);
}

.profile-page .resume-file-meta span:last-child {
  font-size: 14px;
  color: var(--text-subtle);
}

.profile-page .resume-file-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-page .resume-dropzone {
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

.profile-page .resume-dropzone h3 {
  margin: 0;
  font-size: 20px;
  color: var(--text-strong);
}

.profile-page .resume-dropzone p {
  margin: 0;
  font-size: 14px;
  color: var(--text-subtle);
}

.profile-page .resume-dropzone-icon {
  font-size: 28px;
  color: var(--primary-bg);
}

.profile-page .hidden-input {
  display: none;
}

@media (max-width: 1024px) {
  .profile-page .form-grid-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .profile-page .availability-select-row-split {
    grid-template-columns: 1fr;
  }
  .profile-page .availability-inline-divider {
    display: none;
  }
}

@media (max-width: 768px) {
  .profile-page .panel-stack {
    gap: 24px;
    padding-top: 16px;
  }
  .profile-page .form-card {
    padding: 16px;
    border-radius: 12px;
  }
  .profile-page .availability-card {
    padding: 16px;
  }
  .profile-page .form-grid-4,
  .profile-page .form-grid-2,
  .profile-page .availability-select-row-split {
    grid-template-columns: 1fr;
  }
  .profile-page .phone-row {
    flex-direction: column;
  }
  .profile-page .phone-code {
    flex-basis: auto;
  }
  .profile-page .resume-file-card,
  .profile-page .resume-file-actions,
  .profile-page .actions-row,
  .profile-page .availability-footer,
  .profile-page .availability-footer-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .profile-page .availability-field-short {
    max-width: none;
  }
  .profile-page .pilot-table {
    overflow-x: auto;
  }
  .profile-page .pilot-table-head,
  .profile-page .pilot-table-row {
    min-width: 980px;
    grid-template-columns: 150px 140px 150px 150px 150px 150px 72px;
  }
  .profile-page .pilot-submit-btn {
    width: 100%;
  }
}
</style>
