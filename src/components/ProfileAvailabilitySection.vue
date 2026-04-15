<template>
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
        <Button severity="secondary" outlined class="availability-clear-btn" @click="onClear">
          <span class="availability-clear-content">
            <svg class="availability-clear-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 3.75h6a.75.75 0 0 1 .75.75v1.5H19.5a.75.75 0 0 1 0 1.5h-.69l-.63 10.114A2.25 2.25 0 0 1 15.934 20.25H8.066a2.25 2.25 0 0 1-2.245-2.136L5.19 7.5H4.5a.75.75 0 0 1 0-1.5h3.75V4.5A.75.75 0 0 1 9 3.75Zm5.25 2.25v-.75h-4.5V6h4.5Zm-6.928 1.5.595 10.021a.75.75 0 0 0 .749.729h7.868a.75.75 0 0 0 .749-.729l.595-10.02H7.322Zm2.553 2.25a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 .75-.75Zm4.5 0a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 .75-.75Z" fill="currentColor" />
            </svg>
            <span>Clear Availability</span>
          </span>
        </Button>

        <div class="availability-footer-actions">
          <Button label="Discard Changes" severity="secondary" outlined @click="onReset" />
          <Button label="Save" severity="primary" @click="onSave" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import RadioButton from 'primevue/radiobutton';
import SelectButton from 'primevue/selectbutton';

defineProps({
  availabilityDraft: Object,
  monthOptions: Array,
  fullWeekPrimary: Array,
  fullWeekWeekend: Array,
  weekdayOptions: Array,
  weekendOptions: Array,
  normalizeNumberInput: Function,
  onClear: Function,
  onReset: Function,
  onSave: Function
});
</script>
