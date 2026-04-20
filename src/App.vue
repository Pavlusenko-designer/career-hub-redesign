<template>
  <div class="dashboard-container">
    <a class="skip-link" href="#main-content">Skip to main content</a>

    <div class="top-nav">
      <nav aria-label="Dashboard sections">
        <div class="top-nav-scroll" role="tablist" aria-orientation="horizontal" @keydown="onTabKeydown">
          <button
            v-for="(item, index) in visibleTabs"
            :id="getTabId(index)"
            :key="item.label"
            :ref="(element) => setTabRef(element, index)"
            type="button"
            role="tab"
            class="top-nav-tab"
            :class="{ 'top-nav-tab-active': activeTab === index }"
            :aria-selected="activeTab === index"
            :aria-controls="getPanelId(index)"
            :tabindex="activeTab === index ? 0 : -1"
            @click="activateTab(index)"
          >
            <span class="top-nav-tab-label">{{ item.label }}</span>
            <span v-if="item.badge" class="top-nav-tab-badge" :aria-label="`${item.badge} notifications`">{{ item.badge }}</span>
          </button>
          
          <template v-if="isMobile && moreMenuItems.length > 0">
            <button
              type="button"
              class="top-nav-tab"
              @click="toggleMoreMenu"
              aria-haspopup="true"
              aria-controls="more_menu"
            >
              <span class="top-nav-tab-label">More</span>
              <AppIcon name="chevron-down" style="font-size: 14px; margin-left: 4px; color: inherit;" />
            </button>
            <Menu ref="moreMenu" id="more_menu" :model="moreMenuItems" :popup="true">
              <template #item="{ item, props }">
                <a v-bind="props.action" class="p-menuitem-link" style="display: flex; justify-content: space-between; width: 100%;">
                  <span class="p-menuitem-text">{{ item.label }}</span>
                  <span v-if="item.badge" class="top-nav-tab-badge" style="margin-left: 8px;">{{ item.badge }}</span>
                </a>
              </template>
            </Menu>
          </template>
        </div>
      </nav>
    </div>

    <main id="main-content" class="main-content" tabindex="-1">
      <router-view />
    </main>

    <div class="state-toggle-btn">
      <Button
        rounded
        severity="secondary"
        :label="store.isEmptyState ? 'Show Populated State' : 'Show Empty State'"
        @click="store.isEmptyState = !store.isEmptyState"
      >
        <template #icon>
          <AppIcon name="sync" />
        </template>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Menu from 'primevue/menu';
import AppIcon from './components/AppIcon.vue';
import Button from 'primevue/button';
import { store } from './store';

const route = useRoute();
const router = useRouter();

const tabItems = [
  { label: 'Dashboard', icon: '', routeName: 'Dashboard' },
  { label: 'Applications', icon: '', badge: 3, routeName: 'Applications' },
  { label: 'Interviews', icon: '', badge: 3, routeName: 'Interviews' },
  { label: 'Saved Jobs', icon: '', badge: 4, routeName: 'SavedJobs' },
  { label: 'Profile information', icon: '', routeName: 'Profile' },
  { label: 'Job Alerts', icon: '', badge: 2, routeName: 'Alerts' },
  { label: 'Account settings', icon: '', routeName: 'Settings' },
  { label: 'External Login', icon: '', routeName: 'ExternalLogin' }
];

const tabRefs = [];
const isMobile = ref(false);

const activeTab = computed(() => {
  return tabItems.findIndex(item => item.routeName === route.name);
});

const visibleTabs = computed(() => {
  if (!isMobile.value) return tabItems;
  return tabItems.slice(0, 2);
});

const moreMenuItems = computed(() => {
  if (!isMobile.value) return [];
  return tabItems.slice(2).map((item) => {
    return {
      label: item.label,
      command: () => router.push({ name: item.routeName }),
      badge: item.badge
    };
  });
});

const moreMenu = ref(null);

const toggleMoreMenu = (event) => {
  moreMenu.value.toggle(event);
};

const getTabId = (index) => `dashboard-tab-${index}`;
const getPanelId = (index) => `dashboard-panel-${index}`;

const setTabRef = (element, index) => {
  if (!element) return;
  tabRefs[index] = element;
};

const focusTab = (index) => {
  tabRefs[index]?.focus();
};

const activateTab = (index, { moveFocus = false } = {}) => {
  const item = tabItems[index];
  if (item) {
    router.push({ name: item.routeName });
    if (moveFocus) {
      setTimeout(() => focusTab(index), 0);
    }
  }
};

const onTabKeydown = (event) => {
  const lastIndex = tabItems.length - 1;
  let nextIndex = activeTab.value;

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault();
      nextIndex = activeTab.value === lastIndex ? 0 : activeTab.value + 1;
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault();
      nextIndex = activeTab.value === 0 ? lastIndex : activeTab.value - 1;
      break;
    case 'Home':
      event.preventDefault();
      nextIndex = 0;
      break;
    case 'End':
      event.preventDefault();
      nextIndex = lastIndex;
      break;
    default:
      return;
  }

  activateTab(nextIndex, { moveFocus: true });
};

const NAV_BREAKPOINT = 1080; // Threshold where full nav starts to feel crowded

const syncViewport = () => {
  isMobile.value = window.innerWidth <= NAV_BREAKPOINT;
};

onMounted(() => {
  syncViewport();
  window.addEventListener('resize', syncViewport);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncViewport);
});
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: var(--bg-default);
}

.skip-link {
  position: absolute;
  left: 16px;
  top: 12px;
  z-index: 200;
  transform: translateY(-200%);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: var(--text-strong);
  color: #fff;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.skip-link:focus {
  transform: translateY(0);
}

.top-nav {
  padding: 0 40px;
  border-bottom: 1px solid var(--border-color);
}

.top-nav-scroll {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  overflow-x: auto;
  padding: 0;
  scrollbar-width: none;
}

.top-nav-scroll::-webkit-scrollbar {
  display: none;
}

.top-nav-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 56px;
  padding: 1rem 1rem 0.9rem;
  background: transparent;
  color: var(--text-subtle);
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

.top-nav-tab:hover {
  color: var(--text-strong);
  background-color: #f6f8fb;
}

.top-nav-tab-active {
  color: var(--text-strong);
  background-color: #f7faf9;
  border-bottom-color: var(--primary-bg);
  box-shadow: inset 0 -1px 0 rgba(60, 109, 104, 0.12);
}

.top-nav-tab-label {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
}

.top-nav-tab-active .top-nav-tab-label {
  font-weight: 600;
}

.top-nav-tab-badge {
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

.top-nav-tab-active .top-nav-tab-badge {
  background-color: rgba(60, 109, 104, 0.12);
  border-color: rgba(60, 109, 104, 0.28);
}

.state-toggle-btn {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 999px;
}

.mobile-main-header {
  display: inline-flex;
  align-items: center;
  gap: 8px;
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
  display: grid;
  grid-template-columns: minmax(0, 1fr);
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
  min-height: 220px;
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

.mt-auto {
  margin-top: auto;
}

.dashboard-section {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.dashboard-section + .dashboard-section {
  margin-top: 36px;
}

.main-content :deep(.section-hero) + .dashboard-section {
  margin-top: 44px;
}

.onboarding-widget + .dashboard-section {
  margin-top: 48px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
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

.saved-jobs-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.stat-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-subtle);
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

.icon-wrapper :deep(svg) {
  width: 36px;
  height: 36px;
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

.event-title,
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
  .main-content {
    padding: 24px 40px;
  }

  .cards-grid-3,
  .cards-grid-2,
  .saved-jobs-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1080px) {
  .main-content {
    padding: 20px 16px;
    gap: 32px;
  }

  .top-nav {
    position: sticky;
    top: 0;
    z-index: 30;
    padding: 0 16px;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
  }

  .top-nav-scroll {
    justify-content: flex-start;
    gap: 8px;
    padding: 8px 0;
    scroll-snap-type: x proximity;
  }

  .top-nav-tab {
    min-height: 44px;
    padding: 0.75rem 0.95rem;
    border: 1px solid var(--border-color);
    border-radius: 999px;
    border-bottom-width: 1px;
    background-color: #fff;
    scroll-snap-align: start;
  }

  .top-nav-tab-active {
    border-color: rgba(60, 109, 104, 0.34);
    box-shadow: none;
  }

  .cards-grid-3,
  .cards-grid-2,
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

  .dashboard-section + .dashboard-section {
    margin-top: 28px;
  }

  .main-content :deep(.section-hero) + .dashboard-section {
    margin-top: 32px;
  }

  .onboarding-widget + .dashboard-section {
    margin-top: 36px;
  }

  .event-details-inline {
    flex-direction: column;
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

  .placeholder-card {
    padding: 24px;
  }
}
</style>
<style>
.main-content .hero-widgets {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 24px;
}

.main-content .widget-card {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-default);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 32px;
}

.main-content .widget-cv {
  min-height: 220px;
  border: 1px solid transparent;
  background: linear-gradient(var(--bg-default), var(--bg-default)) padding-box, linear-gradient(135deg, #ff914d, #b983ff) border-box;
}

.main-content .widget-label {
  color: #ff7640;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
}

.main-content .widget-title {
  font-size: 26px;
  font-weight: 600;
  color: var(--text-strong);
  margin: 0 0 12px 0;
}

.main-content .widget-text {
  font-size: 16px;
  color: var(--text-default);
  line-height: 24px;
  margin: 0 0 24px 0;
}

.main-content .mt-auto { margin-top: auto; }
.main-content .dashboard-section { display: flex; flex-direction: column; gap: 0; }
.main-content .dashboard-section + .dashboard-section { margin-top: 36px; }
.main-content .section-hero + .dashboard-section { margin-top: 44px; }
.main-content .onboarding-widget + .dashboard-section { margin-top: 48px; }
.main-content .section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 16px; }
.main-content .title-area h1,
.main-content .title-area h2 { font-size: var(--type-title-section-size); line-height: var(--type-title-section-line); font-weight: 600; color: var(--text-strong); margin: 0 0 4px 0; }
.main-content .subtitle { font-size: var(--type-meta-size); line-height: var(--type-meta-line); color: var(--text-subtle); margin: 0; }
.main-content .cards-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.main-content .cards-grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
.main-content .compact-grid { gap: 16px; }
.main-content .cards-list-vertical { display: flex; flex-direction: column; gap: 16px; }
.main-content .events-list { display: flex; flex-direction: column; gap: 24px; }
.main-content .saved-jobs-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.main-content .placeholder-section { padding: 80px 0; }
.main-content .placeholder-card { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; max-width: 720px; padding: 40px; border-radius: 20px; border: 1px dashed var(--border-color); background-color: #fbfcfd; }
.main-content .placeholder-title { font-size: 32px; color: var(--text-strong); margin: 0; }
.main-content .placeholder-text { font-size: 16px; line-height: 26px; color: var(--text-default); margin: 0; }
.main-content .empty-state-container { display: flex; justify-content: center; align-items: center; padding: 80px 20px; background-color: var(--bg-default); border: 1px dashed var(--border-color); border-radius: 16px; text-align: center; }
.main-content .empty-state-content { max-width: 600px; display: flex; flex-direction: column; align-items: center; gap: 24px; }
.main-content .icon-wrapper { width: 80px; height: 80px; background-color: #f0fdf9; border-radius: 50%; display: flex; justify-content: center; align-items: center; }
.main-content .icon-wrapper svg { width: 36px; height: 36px; color: var(--primary-bg); }
.main-content .empty-title { font-size: 28px; font-weight: 700; color: var(--text-strong); margin: 0; }
.main-content .empty-subtitle { font-size: 16px; line-height: 24px; color: var(--text-default); margin: 0; }
.main-content .empty-actions { display: flex; gap: 16px; margin-top: 8px; }
.main-content .popular-searches { margin-top: 32px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.main-content .searches-label { font-size: 14px; font-weight: 600; color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.5px; }
.main-content .search-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
.main-content .event-card { display: flex; background-color: var(--bg-default); border: 1px solid var(--border-color); border-radius: 10px; overflow: hidden; min-height: 200px; }
.main-content .event-image { flex-shrink: 0; width: 240px; }
.main-content .event-image img { width: 100%; height: 100%; object-fit: cover; }
.main-content .event-content { padding: 24px; display: flex; flex-direction: column; flex-grow: 1; gap: 16px; }
.main-content .event-header { display: flex; align-items: flex-start; }
.main-content .event-title-group { display: flex; flex-direction: column; gap: 10px; }
.main-content .event-title, .main-content .event-description { margin: 0; }
.main-content .event-details { display: flex; flex-direction: column; gap: 8px; }
.main-content .event-details-inline { flex-direction: row; flex-wrap: wrap; gap: 10px; }
.main-content .event-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.main-content .event-tag { display: inline-flex; align-items: center; gap: 6px; min-height: 32px; padding: 6px 10px; border-radius: 999px; background-color: #f6f8fb; border: 1px solid var(--border-color); color: var(--text-strong); }
.main-content .event-actions { margin-top: auto; display: flex; gap: 16px; }

@media (max-width: 1024px) {
  .main-content .cards-grid-3,
  .main-content .cards-grid-2,
  .main-content .saved-jobs-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 1080px) {
  .main-content .dashboard-section + .dashboard-section { margin-top: 28px; }
  .main-content .section-hero + .dashboard-section { margin-top: 32px; }
  .main-content .onboarding-widget + .dashboard-section { margin-top: 36px; }
  .main-content .cards-grid-3,
  .main-content .cards-grid-2,
  .main-content .saved-jobs-grid { grid-template-columns: 1fr; gap: 16px; }
  .main-content .event-actions,
  .main-content .empty-actions { flex-direction: column; width: 100%; }
  .main-content .event-card { flex-direction: column; min-height: auto; }
  .main-content .event-image { width: 100%; height: 150px; }
  .main-content .event-content { padding: 20px; }
  .main-content .event-header,
  .main-content .section-header { flex-direction: column; gap: 12px; align-items: flex-start; }
  .main-content .event-details-inline { flex-direction: column; }
  .main-content .widget-card { padding: 20px; }
  .main-content .title-area h2 { font-size: 20px; }
  .main-content .title-area .subtitle { font-size: 14px; margin-top: 4px; }
  .main-content .placeholder-card { padding: 24px; }
}
</style>
