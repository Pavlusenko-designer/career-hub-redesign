<template>
  <div class="info-chip ds-chip-text">
    <AppIcon v-if="iconName" :name="iconName" class="chip-icon" />
    <i v-else :class="icon" aria-hidden="true"></i>
    <span>{{ label }}</span>
  </div>
</template>

<script setup>
import AppIcon from './AppIcon.vue';

defineProps({
  icon: {
    type: String,
    default: ''
  },
  iconName: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.info-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 20px;
  padding: 0;
  color: var(--text-strong);
}

.info-chip i,
.chip-icon {
  color: var(--text-subtle);
  font-size: 12px;
}
</style>
