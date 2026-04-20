import { createRouter, createWebHistory } from 'vue-router';
import DashboardOverviewView from '../components/DashboardOverviewView.vue';
import ApplicationsSectionView from '../components/ApplicationsSectionView.vue';
import InterviewsSectionView from '../components/InterviewsSectionView.vue';
import SavedJobsSectionView from '../components/SavedJobsSectionView.vue';
import ProfileInfoView from '../components/ProfileInfoView.vue';
import JobAlertsView from '../components/JobAlertsView.vue';
import AccountSettingsView from '../components/AccountSettingsView.vue';
import ExternalLoginView from '../components/ExternalLoginView.vue';
import JobDetailsView from '../components/JobDetailsView.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardOverviewView
  },
  {
    path: '/applications',
    name: 'Applications',
    component: ApplicationsSectionView
  },
  {
    path: '/interviews',
    name: 'Interviews',
    component: InterviewsSectionView
  },
  {
    path: '/saved-jobs',
    name: 'SavedJobs',
    component: SavedJobsSectionView
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileInfoView
  },
  {
    path: '/alerts',
    name: 'Alerts',
    component: JobAlertsView
  },
  {
    path: '/settings',
    name: 'Settings',
    component: AccountSettingsView
  },
  {
    path: '/external-login',
    name: 'ExternalLogin',
    component: ExternalLoginView
  },
  {
    path: '/job/:id',
    name: 'JobDetails',
    component: JobDetailsView,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
