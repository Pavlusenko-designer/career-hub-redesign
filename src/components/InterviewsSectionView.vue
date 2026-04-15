<template>
  <div>
    <SectionHero
      eyebrow="Interviews"
      title="Every upcoming interview in one place"
      subtitle="Review unscheduled and scheduled interviews, then open the details when you are ready to prepare."
    />

    <section class="dashboard-section">
      <div class="section-header">
        <div class="title-area">
          <h2>Upcoming Interviews</h2>
          <p class="subtitle">Scheduled sessions and interviews that still need a time</p>
        </div>
      </div>
      <div class="cards-list-vertical">
        <InterviewCard v-for="interview in interviews" :key="`${interview.title}-${interview.date}-${interview.time}`" v-bind="interview" />
      </div>
    </section>
  </div>
</template>

<script setup>
import InterviewCard from './InterviewCard.vue';
import SectionHero from './SectionHero.vue';

defineProps({
  interviews: Array
});
</script>
