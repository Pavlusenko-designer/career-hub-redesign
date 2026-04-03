<template>
  <div class="dashboard-container">
    <div class="top-nav">
      <TabMenu :model="tabItems" :activeIndex="activeTab" @tab-change="onTabChange">
        <template #item="{ item, props }">
          <a v-bind="props.action" class="custom-tab-link">
            <span v-bind="props.label" class="tab-label">{{ item.label }}</span>
            <span v-if="item.badge" class="tab-custom-badge">{{ item.badge }}</span>
          </a>
        </template>
      </TabMenu>
    </div>

    <main class="main-content">
      <template v-if="activeTab === 0">
        <OnboardingWidget />

        <div class="hero-widgets">
          <div class="widget-card widget-cv">
            <span class="widget-label">Recommended</span>
            <h2 class="widget-title">Get matched!</h2>
            <p class="widget-text">Upload your resume and see jobs that match your skills and experience</p>
            <div class="mt-auto">
              <Button label="Search with CV" severity="primary" style="width: 100%" />
            </div>
          </div>

        <div class="widget-card widget-fit">
          <div class="fit-content">
            <h2 class="widget-title">Find your fit with us!</h2>
            <p class="widget-text">Take a short survey about your experience, interests, and preferences to unlock more personalized job recommendations. It's a quick alternative to uploading your CV.</p>

            <div class="checklist">
              <div class="check-item"><i class="pi pi-check-circle"></i> Share your preferred role types</div>
              <div class="check-item"><i class="pi pi-check-circle"></i> Highlight your strengths and interests</div>
              <div class="check-item"><i class="pi pi-check-circle"></i> Set location and work-style preferences</div>
              <div class="check-item"><i class="pi pi-check-circle"></i> Get smarter role recommendations</div>
            </div>
          </div>
          <div class="fit-actions">
            <Button label="Take the survey" icon="pi pi-arrow-right" severity="secondary" outlined />
          </div>
        </div>
        </div>

        <template v-if="!isEmptyState">
          <section class="dashboard-section">
            <div class="section-header">
              <div class="title-area">
                <h2>Saved Jobs</h2>
                <p class="subtitle">Jobs you've bookmarked for later</p>
              </div>
              <a href="#" class="view-all-link" @click.prevent="activeTab = 2">View All <i class="pi pi-arrow-right"></i></a>
            </div>
            <div class="cards-grid-3">
              <JobCard
                v-for="job in savedJobs.slice(0, 3)"
                :key="job.jobId"
                v-bind="job"
              />
            </div>
          </section>

          <section class="dashboard-section">
            <div class="section-header">
              <div class="title-area">
                <h2>Upcoming Interviews</h2>
                <p class="subtitle">Prepare for your scheduled interviews</p>
              </div>
              <a href="#" class="view-all-link">View All <i class="pi pi-arrow-right"></i></a>
            </div>
            <div class="cards-list-vertical">
              <InterviewCard title="Product Manager" status="not_started" />
              <InterviewCard title="Product Manager" status="accepted" format="New York, NY Office" />
              <InterviewCard title="Product Manager" status="in_progress" />
            </div>
          </section>

          <section class="dashboard-section">
            <div class="section-header">
              <div class="title-area">
                <h2>Active Applications</h2>
                <p class="subtitle">Track your application progress</p>
              </div>
              <a href="#" class="view-all-link" @click.prevent="activeTab = 1">View All <i class="pi pi-arrow-right"></i></a>
            </div>
            <div class="cards-grid-3">
              <ApplicationCard
                title="Senior Product Designer"
                team="Experience Design"
                department="Product Design"
                status="interview"
                description="Your portfolio stood out for systems thinking and craft. Pick your interview slot to continue."
                next-step="Choose your preferred interview slot before Friday, 6:00 PM."
              />
              <ApplicationCard
                title="Product Systems Designer"
                team="Design Systems"
                department="Product Design"
                status="in_review"
                description="The hiring team is reviewing your application and your most recent case study."
              />
            </div>
          </section>
        </template>

        <div v-else class="empty-state-container">
          <div class="empty-state-content">
            <div class="icon-wrapper">
              <i class="pi pi-compass"></i>
            </div>
            <h2 class="empty-title">Your career journey starts here</h2>
            <p class="empty-subtitle">You haven't saved or applied to any jobs yet. Start exploring thousands of open roles that natively match your unique skills and preferences.</p>

            <div class="empty-actions">
              <Button label="Explore Jobs" icon="pi pi-search" severity="primary" size="large" />
              <Button label="Job Alerts" icon="pi pi-bell" severity="secondary" outlined size="large" />
            </div>

            <div class="popular-searches">
              <span class="searches-label">Popular Categories to Explore:</span>
              <div class="search-tags">
                <Button label="Product Design" rounded outlined severity="secondary" size="small" />
                <Button label="Software Engineering" rounded outlined severity="secondary" size="small" />
                <Button label="Marketing & Sales" rounded outlined severity="secondary" size="small" />
                <Button label="Data Science" rounded outlined severity="secondary" size="small" />
                <Button label="Customer Success" rounded outlined severity="secondary" size="small" />
              </div>
            </div>
          </div>
        </div>

        <section class="dashboard-section">
          <div class="section-header">
            <div class="title-area">
              <h2>Recommended Events</h2>
              <p class="subtitle">Career events curated for you</p>
            </div>
            <a href="#" class="view-all-link">View All <i class="pi pi-arrow-right"></i></a>
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
                  <InfoChip icon="pi pi-calendar" label="Mar 15, 2026, 10:00 AM EST" />
                  <InfoChip icon="pi pi-map-marker" label="Toronto, Canada" />
                  <InfoChip icon="pi pi-users" label="150 attendees" />
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
                  <InfoChip icon="pi pi-calendar" label="Mar 20, 2026, 10:00 AM EST" />
                  <InfoChip icon="pi pi-map-marker" label="Toronto, Canada" />
                  <InfoChip icon="pi pi-users" label="24 attendees" />
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

      <template v-else-if="activeTab === 1">
        <SectionHero
          eyebrow="Applications"
          title="Keep track of the roles you've already applied to"
          subtitle="Review your current applications, see what stage each one is in, and take the next step when the hiring team needs something from you."
        />

        <section class="application-stats-grid">
          <div class="stat-card stat-card-primary">
            <div class="stat-topline">
              <span class="stat-label">Active Applications</span>
              <span class="stat-pill">2 open</span>
            </div>
            <div class="stat-main">
              <strong class="stat-value">2</strong>
              <p class="stat-copy">Roles still moving through review or interview stages.</p>
            </div>
            <div class="stat-footer">
              <span class="stat-trend positive">1 updated today</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-topline">
              <span class="stat-label">Needs Action</span>
              <span class="stat-icon"><i class="pi pi-bolt"></i></span>
            </div>
            <div class="stat-main">
              <strong class="stat-value">1</strong>
              <p class="stat-copy">One application is waiting on your response right now.</p>
            </div>
            <div class="stat-footer">
              <span class="stat-trend">Interview scheduling due soon</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-topline">
              <span class="stat-label">Latest Stage</span>
              <span class="stat-icon"><i class="pi pi-flag"></i></span>
            </div>
            <div class="stat-main">
              <strong class="stat-value">Interview</strong>
              <p class="stat-copy">Your farthest application has moved into the interview stage.</p>
            </div>
            <div class="stat-footer">
              <span class="stat-trend positive">Good progress this week</span>
            </div>
          </div>
        </section>

        <section class="dashboard-section">
          <div class="section-header">
            <div class="title-area">
              <h2>Needs Your Attention</h2>
              <p class="subtitle">Applications that currently need a response from you</p>
            </div>
          </div>
          <div class="cards-grid-2 compact-grid">
            <ApplicationCard
              v-for="application in attentionApplications"
              :key="application.title"
              v-bind="application"
            />
          </div>
        </section>

        <section class="dashboard-section">
          <div class="section-header">
            <div class="title-area">
              <h2>In Progress</h2>
              <p class="subtitle">Applications still being reviewed by the hiring team</p>
            </div>
          </div>
          <div class="cards-grid-2 compact-grid">
            <ApplicationCard
              v-for="application in inProgressApplications"
              :key="application.title"
              v-bind="application"
            />
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
            <ApplicationCard
              v-for="application in closedApplications"
              :key="application.title"
              v-bind="application"
            />
          </div>
        </section>

        <section class="applications-guidance">
          <div class="guidance-card">
            <span class="widget-label">Recommendations</span>
            <h2 class="guidance-title">A few simple ways to stay on top of your applications</h2>
            <ul class="guidance-list">
              <li>Follow up 7 to 10 days after applying if the role is still open and you have not received an update.</li>
              <li>For interview-stage roles, confirm your availability quickly so you do not lose momentum in the process.</li>
              <li>Before each interview, review the job description again and prepare two or three examples that match the role.</li>
              <li>Keep short notes on each application so it is easier to tailor follow-ups and remember what each team cares about.</li>
              <li>If a role closes, request feedback politely and use it to improve the next application you send.</li>
            </ul>
          </div>
        </section>
      </template>

      <template v-else-if="activeTab === 2">
        <SectionHero
          eyebrow="Saved Jobs"
          title="Your bookmarked roles, all in one place"
          subtitle="Compare the roles you've saved, revisit the job details, and apply whenever you're ready."
        />

        <section class="saved-jobs-summary">
          <div class="saved-summary-card">
            <span class="stat-label">Saved Roles</span>
            <strong class="saved-summary-value">{{ savedJobs.length }}</strong>
            <p class="stat-copy">A short list of roles you wanted to come back to before applying.</p>
          </div>
          <div class="saved-summary-card">
            <span class="stat-label">Top Area</span>
            <strong class="saved-summary-value">Design</strong>
            <p class="stat-copy">Most of your saved roles are in product and design-related teams.</p>
          </div>
        </section>

        <section class="dashboard-section">
          <div class="section-header">
            <div class="title-area">
              <h2>Saved Roles</h2>
              <p class="subtitle">Roles you've bookmarked to review and apply to later</p>
            </div>
          </div>
          <div class="saved-jobs-grid">
            <JobCard
              v-for="job in savedJobs"
              :key="job.jobId"
              v-bind="job"
            />
          </div>
        </section>
      </template>

      <template v-else-if="activeTab === 3">
        <ProfileInfoView />
      </template>

      <template v-else-if="activeTab === 4">
        <JobAlertsView />
      </template>

      <template v-else-if="activeTab === 5">
        <AccountSettingsView />
      </template>

      <template v-else>
        <section class="placeholder-section">
          <div class="placeholder-card">
            <span class="widget-label">Coming Next</span>
            <h2 class="placeholder-title">{{ tabItems[activeTab].label }}</h2>
            <p class="placeholder-text">This section has not been built yet. The Dashboard and Applications experiences are ready to explore in the current prototype.</p>
            <Button label="Back to Dashboard" icon="pi pi-arrow-left" severity="secondary" outlined @click="activeTab = 0" />
          </div>
        </section>
      </template>
    </main>

    <div class="state-toggle-btn">
      <Button
        rounded
        severity="secondary"
        icon="pi pi-sync"
        :label="isEmptyState ? 'Show Populated State' : 'Show Empty State'"
        @click="isEmptyState = !isEmptyState"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TabMenu from 'primevue/tabmenu';

import JobCard from './components/JobCard.vue';
import InterviewCard from './components/InterviewCard.vue';
import ApplicationCard from './components/ApplicationCard.vue';
import InfoChip from './components/InfoChip.vue';
import OnboardingWidget from './components/OnboardingWidget.vue';
import ProfileInfoView from './components/ProfileInfoView.vue';
import JobAlertsView from './components/JobAlertsView.vue';
import AccountSettingsView from './components/AccountSettingsView.vue';
import SectionHero from './components/SectionHero.vue';
import Tag from 'primevue/tag';
import Button from 'primevue/button';

const tabItems = ref([
  { label: 'Dashboard', icon: '' },
  { label: 'Applications', icon: '', badge: 4 },
  { label: 'Saved Jobs', icon: '', badge: 4 },
  { label: 'Profile information', icon: '' },
  { label: 'Job Alerts', icon: '', badge: 2 },
  { label: 'Account settings', icon: '' }
]);

const savedJobs = [
  {
    title: 'Senior Product Designer',
    category: 'Design',
    location: 'New York, NY Office',
    workType: 'Hybrid',
    jobId: 'R1495971',
    description: 'Lead end-to-end product design work across core user journeys, from concept exploration through launch.'
  },
  {
    title: 'Product Designer',
    category: 'Design Systems',
    location: 'Remote, US',
    workType: 'Full-time',
    jobId: 'R1496042',
    description: 'Shape the future of the design system and partner closely with product teams to scale quality across the platform.'
  },
  {
    title: 'Product Manager',
    category: 'Product',
    location: 'Toronto, Canada',
    workType: 'On-site',
    jobId: 'R1496118',
    description: 'Drive product direction for a key platform area and work with design and engineering to deliver measurable impact.'
  },
  {
    title: 'UX Researcher',
    category: 'Research',
    location: 'Remote, Canada',
    workType: 'Full-time',
    jobId: 'R1496176',
    description: 'Plan and run mixed-method studies that uncover user needs and guide product decisions across the roadmap.'
  }
];

const attentionApplications = [
  {
    title: 'Senior Product Designer',
    team: 'Experience Design',
    department: 'Product Design',
    appliedDate: 'Mar 16, 2026',
    lastUpdated: 'Interview invite received today',
    status: 'interview',
    description: 'The hiring manager wants to meet this week. Lock in a timeslot and review the role brief.',
    nextStep: 'Pick one of the three interview slots before 5:00 PM.',
    location: 'Remote, US',
    jobId: 'R-10291'
  }
];

const inProgressApplications = [
  {
    title: 'Product Systems Designer',
    team: 'Design Systems',
    department: 'Product Design',
    appliedDate: 'Mar 14, 2026',
    lastUpdated: 'Updated 1 day ago',
    status: 'in_review',
    description: 'Recruiting is reviewing your design systems case study and collaborator feedback.',
    location: 'Remote, Europe',
    jobId: 'R-21980'
  }
];

const closedApplications = [
  {
    title: 'Senior Product Designer',
    team: 'Content Experience',
    department: 'Product Design',
    appliedDate: 'Feb 09, 2026',
    lastUpdated: 'Closed 3 days ago',
    status: 'rejected',
    description: 'The team moved forward with another candidate, but your background was a close match.',
    nextStep: 'Request recruiter feedback or explore similar roles on nearby teams.',
    location: 'Remote, US',
    jobId: 'R-45002'
  }
];

const isEmptyState = ref(false);
const activeTab = ref(0);

const onTabChange = (event) => {
  activeTab.value = event.index;
};
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: var(--bg-default);
}

.top-nav {
  padding: 0 40px;
  border-bottom: 1px solid var(--border-color);
}

.custom-tab-link {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
  text-decoration: none;
  cursor: pointer;
}

.tab-label {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
}

.tab-custom-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  color: var(--text-strong);
  padding: 0 6px;
  background-color: #f4f6f8;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
}

.state-toggle-btn {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-radius: 999px;
}

:deep(.p-tabmenu-nav) {
  justify-content: center;
  gap: 4px;
}

:deep(.p-tabmenu .p-tabmenu-nav) {
  border: none;
  background: transparent;
}

:deep(.p-tabmenu .p-tabmenu-nav .p-menuitem) {
  margin: 0;
}

:deep(.p-tabmenu-nav .p-menuitem-link) {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  padding: 1rem 1rem 0.9rem;
  background: transparent;
  color: var(--text-subtle);
  border-bottom: 3px solid transparent;
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

:deep(.p-tabmenu-nav .p-menuitem-link:hover) {
  color: var(--text-strong);
  background-color: #f6f8fb;
}

:deep(.p-tabmenu-nav .p-highlight .p-menuitem-link) {
  color: var(--text-strong);
  background-color: #f7faf9;
  border-bottom-color: var(--primary-bg);
  box-shadow: inset 0 -1px 0 rgba(60, 109, 104, 0.12);
}

:deep(.p-tabmenu-nav .p-highlight .tab-label) {
  font-weight: 600;
}

:deep(.p-tabmenu-nav .p-highlight .tab-custom-badge) {
  background-color: rgba(60, 109, 104, 0.12);
  border-color: rgba(60, 109, 104, 0.28);
}

:deep(.p-tabmenu-nav .p-highlight:hover .p-menuitem-link) {
  background-color: #f7faf9;
}

.main-content {
  padding: 40px 80px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 1600px;
  margin: 0 auto;
}

.hero-widgets {
  display: flex;
  gap: 24px;
}

.widget-card {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-default);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 32px;
}

.widget-cv {
  flex: 1;
  border: 1px solid transparent;
  background: linear-gradient(var(--bg-default), var(--bg-default)) padding-box,
              linear-gradient(135deg, #ff914d, #b983ff) border-box;
}

.widget-label {
  color: #ff7640;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
}

.widget-title {
  font-size: 26px;
  font-weight: 600;
  color: var(--text-strong);
  margin: 0 0 12px 0;
}

.widget-text {
  font-size: 16px;
  color: var(--text-default);
  line-height: 24px;
  margin: 0 0 24px 0;
}

.widget-fit {
  flex: 2;
  flex-direction: row;
  justify-content: space-between;
  gap: 24px;
}

.fit-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.checklist {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: var(--text-subtle);
}

.check-item i {
  color: var(--text-subtle);
  font-size: 18px;
}

.fit-actions {
  display: flex;
  align-items: flex-end;
  flex-shrink: 0;
  min-width: 180px;
}

.mt-auto {
  margin-top: auto;
}

.dashboard-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.title-area h1,
.title-area h2 {
  font-size: var(--type-title-section-size);
  line-height: var(--type-title-section-line);
  font-weight: 600;
  color: var(--text-strong);
  margin: 0 0 4px 0;
}

.subtitle {
  font-size: var(--type-meta-size);
  line-height: var(--type-meta-line);
  color: var(--text-subtle);
  margin: 0;
}

.cards-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.cards-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.compact-grid {
  gap: 16px;
}

.cards-list-vertical {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.saved-jobs-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.saved-summary-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border-radius: 14px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-default);
}

.saved-summary-value {
  font-size: 32px;
  line-height: 1;
  color: var(--text-strong);
}

.saved-jobs-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.applications-guidance {
  display: flex;
}

.guidance-card {
  width: 100%;
  padding: 24px 28px;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background-color: var(--bg-default);
}

.guidance-title {
  margin: 0 0 16px;
  font-size: 24px;
  line-height: 1.2;
  color: var(--text-strong);
}

.guidance-list {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: var(--text-default);
  font-size: 15px;
  line-height: 24px;
}

.application-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  border-radius: 14px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-default);
}

.stat-topline,
.stat-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.stat-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-subtle);
}

.stat-pill,
.stat-icon,
.stat-trend {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background-color: #f6f8fb;
  border: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-strong);
}

.stat-icon {
  width: 28px;
  padding: 0;
}

.stat-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-value {
  font-size: 34px;
  line-height: 1;
  color: var(--text-strong);
}

.stat-copy {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: var(--text-default);
}

.stat-trend.positive {
  color: var(--text-strong);
}

.placeholder-section {
  padding: 80px 0;
}

.placeholder-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  max-width: 720px;
  padding: 40px;
  border-radius: 20px;
  border: 1px dashed var(--border-color);
  background-color: #fbfcfd;
}

.placeholder-title {
  font-size: 32px;
  color: var(--text-strong);
  margin: 0;
}

.placeholder-text {
  font-size: 16px;
  line-height: 26px;
  color: var(--text-default);
  margin: 0;
}

.empty-state-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  background-color: var(--bg-default);
  border: 1px dashed var(--border-color);
  border-radius: 16px;
  text-align: center;
}

.empty-state-content {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  background-color: #f0fdf9;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-wrapper i {
  font-size: 36px;
  color: var(--primary-bg);
}

.empty-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-strong);
  margin: 0;
}

.empty-subtitle {
  font-size: 16px;
  line-height: 24px;
  color: var(--text-default);
  margin: 0;
}

.empty-actions {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.popular-searches {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.searches-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.search-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.event-card {
  display: flex;
  background-color: var(--bg-default);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  overflow: hidden;
  min-height: 200px;
}

.event-image {
  flex-shrink: 0;
  width: 240px;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 16px;
}

.event-header {
  display: flex;
  align-items: flex-start;
}

.event-title-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.event-title {
  margin: 0;
}

.event-description {
  margin: 0;
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.event-details-inline {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
}

.event-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.event-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  padding: 6px 10px;
  border-radius: 999px;
  background-color: #f6f8fb;
  border: 1px solid var(--border-color);
}

.event-tag {
  color: var(--text-strong);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-subtle);
}

.detail-item i {
  font-size: 14px;
}

.event-actions {
  margin-top: auto;
  display: flex;
  gap: 16px;
}

@media (max-width: 1024px) {
  .hero-widgets {
    flex-direction: column;
  }

  .widget-fit {
    flex-direction: column;
    gap: 24px;
  }

  .main-content {
    padding: 24px 40px;
  }

  .cards-grid-3,
  .cards-grid-2,
  .application-stats-grid,
  .saved-jobs-summary,
  .saved-jobs-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px 16px;
    gap: 32px;
  }

  .top-nav {
    padding: 0 16px;
    overflow-x: auto;
  }

  .cards-grid-3,
  .cards-grid-2,
  .application-stats-grid,
  .saved-jobs-summary,
  .saved-jobs-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .event-actions,
  .empty-actions {
    flex-direction: column;
    width: 100%;
  }

  .event-actions :deep(.p-button),
  .empty-actions :deep(.p-button) {
    width: 100%;
    justify-content: center;
  }

  .event-card {
    flex-direction: column;
    min-height: auto;
  }

  .event-image {
    width: 100%;
    height: 150px;
  }

  .event-content {
    padding: 20px;
  }

  .event-header,
  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .event-details-inline {
    flex-direction: column;
  }

  .checklist {
    grid-template-columns: 1fr;
  }

  .widget-card {
    padding: 20px;
  }

  .title-area h2 {
    font-size: 20px;
  }

  .title-area .subtitle {
    font-size: 14px;
    margin-top: 4px;
  }

  .fit-actions {
    width: 100%;
    margin-top: 24px;
  }

  .fit-actions :deep(.p-button) {
    width: 100%;
    justify-content: center;
  }

  .placeholder-card {
    padding: 24px;
  }
}
</style>
