<template>
  <SectionHero
    eyebrow="Apply externally"
    title="Submit your application through our hiring portals"
    subtitle="Depending on the role and region, we manage applications across several platforms. Find the right portal below, sign in, and complete your application there."
  />

  <section class="dashboard-section">
    <div class="portals-list">
      <div v-for="portal in portals" :key="portal.name" class="portal-card">
        <div class="portal-card-main">
          <div class="portal-card-header">
            <h3 class="portal-name ds-title-card">{{ portal.name }}</h3>
            <Button
              :label="`Go to ${portal.shortName}`"
              severity="secondary"
              outlined
            >
              <template #icon>
                <AppIcon name="arrow-right" />
              </template>
            </Button>
          </div>

          <p class="portal-description ds-body-sm">{{ portal.description }}</p>

          <div class="portal-categories">
            <span class="categories-label ds-meta">Roles posted here:</span>
            <div class="category-chips">
              <span
                v-for="category in portal.categories"
                :key="category"
                class="category-chip ds-chip-text"
              >{{ category }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import SectionHero from './SectionHero.vue';
import AppIcon from './AppIcon.vue';
import Button from 'primevue/button';

const portals = [
  {
    name: 'Workday',
    shortName: 'Workday',
    description: 'Our primary platform for corporate and business function roles across all global office locations. If you are applying for a position in finance, HR, legal, or operations, this is where your application will be managed.',
    categories: ['Finance', 'Human Resources', 'Legal & Compliance', 'Operations', 'Corporate']
  },
  {
    name: 'SAP SuccessFactors',
    shortName: 'SuccessFactors',
    description: 'Used for technology and consulting roles within our EMEA and APAC regions. Positions that sit within the SAP ecosystem or involve cross-border collaboration are posted and tracked here.',
    categories: ['Technology', 'Consulting', 'EMEA Roles', 'APAC Roles', 'SAP Ecosystem']
  },
  {
    name: 'Greenhouse',
    shortName: 'Greenhouse',
    description: 'Where we manage applications for product, design, and engineering openings on our innovation and platform teams. Most roles within our digital product organisation are posted here.',
    categories: ['Product Management', 'Product Design', 'Engineering', 'Data & Analytics', 'Research']
  },
  {
    name: 'Lever',
    shortName: 'Lever',
    description: 'Handles go-to-market and customer-facing hiring for our North America teams. If you are looking for a role in sales, marketing, or customer success, your application will be reviewed through this portal.',
    categories: ['Sales', 'Marketing', 'Customer Success', 'Partnerships', 'Go-to-Market']
  }
];
</script>

<style scoped>
.dashboard-section {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 40px;
}

.portals-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.portal-card {
  padding: 28px 32px;
  background-color: var(--bg-default);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.portal-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border-color: #b8c0cc;
}

.portal-card-main {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.portal-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.portal-name {
  margin: 0;
}

.portal-description {
  margin: 0;
  color: var(--text-subtle);
  max-width: 680px;
  line-height: 22px;
}

.portal-categories {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}

.categories-label {
  white-space: nowrap;
  flex-shrink: 0;
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background-color: #f4f6f8;
  border: 1px solid var(--border-color);
  color: var(--text-subtle);
  font-size: 12px;
}

@media (max-width: 768px) {
  .dashboard-section {
    margin-top: 28px;
  }

  .portal-card {
    padding: 20px;
  }

  .portal-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .portal-categories {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
