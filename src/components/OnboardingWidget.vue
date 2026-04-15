<template>
  <div class="onboarding-widget">
    <div class="text-content">
      <span class="eyebrow ds-eyebrow">Dashboard</span>
      <h2 class="title ds-title-hero">Welcome to Career Hub.</h2>
      <p class="subtitle ds-body">Explore your saved roles, active applications, and upcoming interviews all in one place.</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.onboarding-widget {
  background-color: var(--bg-default);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 32px;
}

.text-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 680px;
}

@media (max-width: 768px) {
  .onboarding-widget {
    padding: 24px 20px;
  }
}
</style>
