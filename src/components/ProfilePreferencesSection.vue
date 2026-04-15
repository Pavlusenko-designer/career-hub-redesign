<template>
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
      <Button label="Discard Changes" severity="secondary" outlined @click="onReset" />
      <Button label="Save" severity="primary" @click="onSave" />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Chips from 'primevue/chips';
import InputText from 'primevue/inputtext';
import SelectButton from 'primevue/selectbutton';

defineProps({
  preferencesDraft: Object,
  experienceOptions: Array,
  onReset: Function,
  onSave: Function
});
</script>
