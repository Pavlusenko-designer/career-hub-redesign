<template>
  <div>
    <SectionHero
      eyebrow="Applications"
      title="Keep track of the roles you've already applied to"
      subtitle="Review your current applications and open the role details whenever you want a closer look."
    />

    <section class="dashboard-section">
      <div class="section-header">
        <div class="title-area">
          <h2>Active Applications</h2>
          <p class="subtitle">Applications still moving through pre-interview stages</p>
        </div>
      </div>
      <div class="cards-grid-2 compact-grid">
        <ApplicationCard v-for="application in activeApplications" :key="application.title" v-bind="application" :show-highlight="false" />
      </div>
    </section>

    <section class="dashboard-section">
      <div class="section-header">
        <div class="title-area">
          <h2>Closed Applications</h2>
          <p class="subtitle">Past applications and completed hiring flows</p>
        </div>
      </div>
      <div class="cards-grid-2 compact-grid">
        <ApplicationCard v-for="application in closedApplications" :key="application.title" v-bind="application" :show-highlight="false" />
      </div>
    </section>
  </div>
</template>

<script setup>
import ApplicationCard from './ApplicationCard.vue';
import SectionHero from './SectionHero.vue';

defineProps({
  activeApplications: Array,
  closedApplications: Array
});
</script>
