<template>
  <div>
    <SectionHero
      eyebrow="Saved Jobs"
      title="Your bookmarked roles, all in one place"
      subtitle="Compare the roles you've saved, revisit the job details, and apply whenever you're ready."
    />

    <section class="dashboard-section">
      <div class="section-header">
        <div class="title-area">
          <h2>Saved Roles</h2>
          <p class="subtitle">Roles you've bookmarked to review and apply to later</p>
        </div>
      </div>
      <div class="saved-jobs-grid">
        <JobCard v-for="job in savedJobs" :key="job.jobId" v-bind="job" />
      </div>
    </section>
  </div>
</template>

<script setup>
import JobCard from './JobCard.vue';
import SectionHero from './SectionHero.vue';

defineProps({
  savedJobs: Array
});
</script>
