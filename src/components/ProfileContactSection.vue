<template>
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
      <Button label="Discard Changes" severity="secondary" outlined @click="onReset" />
      <Button label="Save" severity="primary" @click="onSave" />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputMask from 'primevue/inputmask';
import InputText from 'primevue/inputtext';

defineProps({
  contactDraft: Object,
  genderOptions: Array,
  countryCodeOptions: Array,
  getCountryByDialCode: Function,
  onReset: Function,
  onSave: Function
});
</script>
