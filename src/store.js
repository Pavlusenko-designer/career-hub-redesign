import { reactive } from 'vue';

export const store = reactive({
  isEmptyState: false,
  selectedJobForDetails: null,
  
  // Data from App.vue
  savedJobs: [
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
  ],
  
  interviews: [
    {
      title: 'Product Manager',
      status: 'not_started',
      description: 'Intro conversation with recruiting to confirm your background, motivations, and role fit.',
      date: 'To be scheduled',
      time: '30 min',
      format: 'Google Meet',
      avatarLabel: 'R'
    },
    {
      title: 'Senior Product Designer',
      status: 'accepted',
      description: 'Portfolio review with the hiring manager focused on systems thinking and execution quality.',
      date: 'Apr 15, 2026',
      time: '1:30 PM EET',
      format: 'Remote video',
      avatarLabel: 'A'
    },
    {
      title: 'Product Systems Designer',
      status: 'in_progress',
      description: 'Panel interview with design and engineering partners to walk through collaboration examples.',
      date: 'Apr 18, 2026',
      time: '4:00 PM EET',
      format: 'New York, NY Office',
      avatarLabel: 'D'
    }
  ],
  
  activeApplications: [
    {
      title: 'Senior Product Designer',
      team: 'Experience Design',
      department: 'Product Design',
      appliedDate: 'Mar 16, 2026',
      lastUpdated: 'Updated today',
      status: 'in_review',
      description: 'Lead product design across complex user journeys and turn research into polished, scalable experiences.',
      nextStep: 'No action needed yet. We will share the next step as soon as review is complete.',
      location: 'Remote, US',
      jobId: 'R-10291'
    },
    {
      title: 'Product Systems Designer',
      team: 'Design Systems',
      department: 'Product Design',
      appliedDate: 'Mar 14, 2026',
      lastUpdated: 'Updated 1 day ago',
      status: 'submitted',
      description: 'Shape the future of the design system and partner with product teams to raise quality across the platform.',
      location: 'Remote, Europe',
      jobId: 'R-21980'
    }
  ],
  
  closedApplications: [
    {
      title: 'Senior Product Designer',
      team: 'Content Experience',
      department: 'Product Design',
      appliedDate: 'Feb 09, 2026',
      lastUpdated: 'Closed 3 days ago',
      status: 'rejected',
      description: 'Drive content-focused product design work that improves clarity, usability, and trust across core journeys.',
      location: 'Remote, US',
      jobId: 'R-45002'
    }
  ],

  // Helpers
  get dashboardApplications() {
    return this.activeApplications.slice(0, 2);
  }
});
