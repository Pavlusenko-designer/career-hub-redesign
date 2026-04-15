<template>
  <div>
    <OnboardingWidget />

    <template v-if="!isEmptyState">
      <section class="dashboard-section">
        <div class="section-header">
          <div class="title-area">
            <h2>Upcoming Interviews</h2>
            <p class="subtitle">Prepare for your scheduled interviews</p>
          </div>
          <a href="#" class="view-all-link" @click.prevent="$emit('navigate', 2)">View All <AppIcon name="arrow-right" /></a>
        </div>
        <div class="cards-list-vertical">
          <InterviewCard v-for="interview in interviews.slice(0, 3)" :key="`${interview.title}-${interview.date}-${interview.time}`" v-bind="interview" />
        </div>
      </section>

      <section class="dashboard-section">
        <div class="section-header">
          <div class="title-area">
            <h2>Active Applications</h2>
            <p class="subtitle">Track your application progress</p>
          </div>
          <a href="#" class="view-all-link" @click.prevent="$emit('navigate', 1)">View All <AppIcon name="arrow-right" /></a>
        </div>
        <div class="cards-grid-3">
          <ApplicationCard v-for="application in dashboardApplications" :key="application.title" v-bind="application" :show-highlight="false" />
        </div>
      </section>

      <section class="dashboard-section">
        <div class="section-header">
          <div class="title-area">
            <h2>Saved Jobs</h2>
            <p class="subtitle">Jobs you've bookmarked for later</p>
          </div>
          <a href="#" class="view-all-link" @click.prevent="$emit('navigate', 3)">View All <AppIcon name="arrow-right" /></a>
        </div>
        <div class="cards-grid-3">
          <JobCard v-for="job in savedJobs.slice(0, 3)" :key="job.jobId" v-bind="job" />
        </div>
      </section>

      <section class="dashboard-section">
        <div class="hero-widgets">
          <div class="widget-card widget-cv">
            <span class="widget-label">Recommended</span>
            <h2 class="widget-title">Get matched!</h2>
            <p class="widget-text">Upload your resume and see jobs that match your skills and experience.</p>
            <div class="mt-auto">
              <Button label="Search with CV" severity="primary" style="width: 100%" />
            </div>
          </div>
        </div>
      </section>

      <section class="dashboard-section">
        <div class="section-header">
          <div class="title-area">
            <h2>Recommended Events</h2>
            <p class="subtitle">Career events curated for you</p>
          </div>
          <a href="#" class="view-all-link">View All <AppIcon name="arrow-right" /></a>
        </div>
        <div class="events-list">
          <div class="event-card">
            <div class="event-image">
              <img src="/tech_career_fair.png" alt="Tech Career Fair 2028" />
            </div>
            <div class="event-content">
              <div class="event-header">
                <div class="event-title-group">
                  <h3 class="event-title ds-title-card">Tech Career Fair 2028</h3>
                  <div class="event-tags">
                    <span class="event-tag ds-chip-text">Conference</span>
                    <span class="event-tag ds-chip-text">In person</span>
                  </div>
                </div>
              </div>
              <p class="event-description ds-body">Connect with top tech companies and explore exciting career opportunities.</p>
              <div class="event-details event-details-inline">
                <InfoChip icon-name="calendar" label="Mar 15, 2026, 10:00 AM EST" />
                <InfoChip icon-name="map-marker" label="Toronto, Canada" />
                <InfoChip icon-name="users" label="150 attendees" />
              </div>
              <div class="event-actions">
                <Button label="Learn More" severity="secondary" outlined />
                <Button label="Register Now" severity="primary" />
              </div>
            </div>
          </div>

          <div class="event-card">
            <div class="event-image">
              <img src="/workshop_event.png" alt="Product Management Workshop" />
            </div>
            <div class="event-content">
              <div class="event-header">
                <div class="event-title-group">
                  <h3 class="event-title ds-title-card">Product Management Workshop</h3>
                  <div class="event-tags">
                    <span class="event-tag ds-chip-text">Workshop</span>
                    <span class="event-tag ds-chip-text">Small group</span>
                  </div>
                </div>
              </div>
              <p class="event-description ds-body">Learn essential PM skills from industry leaders and network with peers</p>
              <div class="event-details event-details-inline">
                <InfoChip icon-name="calendar" label="Mar 20, 2026, 10:00 AM EST" />
                <InfoChip icon-name="map-marker" label="Toronto, Canada" />
                <InfoChip icon-name="users" label="24 attendees" />
              </div>
              <div class="event-actions">
                <Button label="Learn More" severity="secondary" outlined />
                <Button label="Register Now" severity="primary" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <div v-else class="empty-state-stack">
      <div class="empty-state-container">
        <div class="empty-state-content">
          <div class="icon-wrapper">
            <AppIcon name="compass" />
          </div>
          <h2 class="empty-title">Your career journey starts here</h2>
          <p class="empty-subtitle">You haven't saved or applied to any jobs yet. Start exploring thousands of open roles that natively match your unique skills and preferences.</p>

          <div class="empty-actions">
            <Button label="Explore Jobs" severity="primary" size="large">
              <template #icon>
                <AppIcon name="search" />
              </template>
            </Button>
          </div>
        </div>
      </div>

      <div class="empty-state-widget">
        <div class="widget-card widget-cv">
          <span class="widget-label">Recommended</span>
          <h2 class="widget-title">Get matched!</h2>
          <p class="widget-text">Upload your resume and see jobs that match your skills and experience.</p>
          <div class="mt-auto">
            <Button label="Search with CV" severity="primary" style="width: 100%" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
import AppIcon from './AppIcon.vue';
import ApplicationCard from './ApplicationCard.vue';
import InfoChip from './InfoChip.vue';
import InterviewCard from './InterviewCard.vue';
import JobCard from './JobCard.vue';
import OnboardingWidget from './OnboardingWidget.vue';

defineProps({
  isEmptyState: Boolean,
  savedJobs: Array,
  interviews: Array,
  dashboardApplications: Array
});

defineEmits(['navigate']);
</script>

<style scoped>
.empty-state-stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
}

.empty-state-widget {
  width: 100%;
}
</style>
