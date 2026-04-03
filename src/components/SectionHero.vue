<template>
  <section class="section-hero">
    <div class="section-hero-copy">
      <span v-if="eyebrow" class="section-hero-eyebrow ds-eyebrow">{{ eyebrow }}</span>
      <h1 class="section-hero-title ds-title-hero">{{ title }}</h1>
      <p v-if="subtitle" class="section-hero-subtitle ds-body">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="section-hero-actions">
      <slot name="actions" />
    </div>
  </section>
</template>

<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.section-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  padding: 32px;
  border: 1px solid var(--border-color);
  border-radius: 18px;
  background-color: var(--bg-default);
}

.section-hero-copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.section-hero-eyebrow {
  margin-bottom: 4px;
}

.section-hero-title {
  margin: 0;
}

.section-hero-subtitle {
  margin: 0;
  color: var(--text-subtle);
}

.section-hero-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .section-hero {
    flex-direction: column;
    align-items: stretch;
    padding: 20px;
  }

  .section-hero-title {
    font-size: 30px;
  }

  .section-hero-actions {
    width: 100%;
  }

  .section-hero-actions :deep(.p-button) {
    width: 100%;
    justify-content: center;
  }
}
</style>
