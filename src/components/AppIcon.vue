<template>
  <svg
    class="app-icon"
    :class="[`app-icon-${name}`, { 'app-icon-stroke': mode === 'stroke' }]"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <g v-if="name === 'arrow-right'">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </g>
    <g v-else-if="name === 'arrow-left'">
      <path d="M19 12H6" />
      <path d="m11 6-6 6 6 6" />
    </g>
    <g v-else-if="name === 'calendar'">
      <path d="M7 3v3M17 3v3" />
      <rect x="4" y="5" width="16" height="15" rx="2" ry="2" />
      <path d="M4 9h16" />
    </g>
    <g v-else-if="name === 'clock'">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </g>
    <g v-else-if="name === 'map-marker'">
      <path d="M12 21s6-5.33 6-11a6 6 0 1 0-12 0c0 5.67 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </g>
    <g v-else-if="name === 'users'">
      <path d="M16.5 19v-1a3.5 3.5 0 0 0-3.5-3.5h-2A3.5 3.5 0 0 0 7.5 18v1" />
      <circle cx="12" cy="8" r="3" />
      <path d="M18 19v-1a3 3 0 0 0-2.2-2.9" />
      <path d="M6 19v-1a3 3 0 0 1 2.2-2.9" />
    </g>
    <g v-else-if="name === 'compass'">
      <circle cx="12" cy="12" r="8" />
      <path d="m14.8 9.2-2 5.6-5.6 2 2-5.6 5.6-2Z" />
    </g>
    <g v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.35-4.35" />
    </g>
    <g v-else-if="name === 'bell'">
      <path d="M15 17H9a2 2 0 0 1-2-2v-3a5 5 0 1 1 10 0v3a2 2 0 0 1-2 2Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </g>
    <g v-else-if="name === 'sync'">
      <path d="M20 6v5h-5" />
      <path d="M4 18v-5h5" />
      <path d="M7.5 9A6.5 6.5 0 0 1 19 11" />
      <path d="M16.5 15A6.5 6.5 0 0 1 5 13" />
    </g>
    <g v-else-if="name === 'tag'">
      <path d="m20 12-8 8-8-8V4h8l8 8Z" />
      <circle cx="8.5" cy="8.5" r="1.2" />
    </g>
    <g v-else-if="name === 'briefcase'">
      <rect x="4" y="7" width="16" height="12" rx="2" ry="2" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M4 11h16" />
    </g>
    <g v-else-if="name === 'heart-fill'">
      <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.65-7 10-7 10Z" />
    </g>
    <g v-else-if="name === 'video'">
      <rect x="4" y="7" width="11" height="10" rx="2" ry="2" />
      <path d="m15 10 5-2.5v9L15 14" />
    </g>
    <g v-else-if="name === 'calendar-plus'">
      <path d="M7 3v3M17 3v3" />
      <rect x="4" y="5" width="16" height="15" rx="2" ry="2" />
      <path d="M4 9h16" />
      <path d="M12 12v5M9.5 14.5h5" />
    </g>
    <g v-else-if="name === 'ellipsis-v'">
      <circle cx="12" cy="6" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="18" r="1.5" />
    </g>
    <g v-else-if="name === 'check'">
      <path d="m5 12 4.2 4.2L19 6.5" />
    </g>
    <g v-else-if="name === 'times'">
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </g>
    <g v-else-if="name === 'pencil'">
      <path d="m4 20 4.5-1 9-9a2.1 2.1 0 0 0-3-3l-9 9L4 20Z" />
      <path d="m13.5 6.5 4 4" />
    </g>
    <g v-else-if="name === 'chevron-down'">
      <path d="m6 9 6 6 6-6" />
    </g>
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  }
});

const strokeIcons = new Set([
  'arrow-right',
  'arrow-left',
  'calendar',
  'clock',
  'map-marker',
  'users',
  'compass',
  'search',
  'bell',
  'sync',
  'tag',
  'briefcase',
  'video',
  'calendar-plus',
  'check',
  'times',
  'pencil',
  'chevron-down'
]);

const mode = computed(() => (strokeIcons.has(props.name) ? 'stroke' : 'fill'));
</script>

<style scoped>
.app-icon {
  width: 1em;
  height: 1em;
  display: inline-block;
  flex: 0 0 auto;
  color: currentColor;
}

.app-icon-stroke {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.app-icon:not(.app-icon-stroke) {
  fill: currentColor;
}
</style>
