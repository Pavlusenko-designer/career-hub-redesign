<template>
  <div class="info-chip ds-chip-text">
    <i :class="icon"></i>
    <span>{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true
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

.info-chip i {
  color: var(--text-subtle);
  font-size: 12px;
}
</style>
