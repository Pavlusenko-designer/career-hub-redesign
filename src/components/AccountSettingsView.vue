<template>
  <section class="account-settings-page">
    <SectionHero
      eyebrow="Account Settings"
      title="Manage your account"
      subtitle="Review how you sign in, control email preferences, and manage account-level actions."
    />

    <div class="settings-stack">
      <section class="settings-card">
        <div class="settings-copy">
          <h2>Email address</h2>
          <p class="settings-value">alex.morgan@example.com</p>
          <p class="settings-description">You're logged in using Google</p>
        </div>
        <div class="settings-actions">
          <Button label="Log out" severity="secondary" outlined />
        </div>
      </section>

      <section class="settings-card">
        <div class="settings-copy">
          <h2>Passwordless login</h2>
          <p class="settings-description">Open the new OTP login modal and choose whether you want to receive your verification code by email or SMS.</p>
        </div>
        <div class="settings-actions">
          <Button label="Open login modal" severity="primary" @click="isLoginDialogVisible = true" />
        </div>
      </section>

      <section class="settings-card">
        <div class="settings-copy">
          <h2>Subscriptions</h2>
        </div>
        <div class="subscription-row">
          <Checkbox v-model="companyUpdates" inputId="company-updates" :binary="true" />
          <label for="company-updates">Sign me up for company updates</label>
        </div>
      </section>

      <section class="settings-card settings-card-danger">
        <div class="settings-copy">
          <h2>Delete account</h2>
          <p class="settings-description">This action will delete your account and cannot be undone.</p>
        </div>
        <div class="settings-actions">
          <Button label="Delete your account" severity="secondary" outlined class="danger-action-btn" />
        </div>
      </section>
    </div>

    <LoginOtpDialog v-model:visible="isLoginDialogVisible" />
  </section>
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import LoginOtpDialog from './LoginOtpDialog.vue';
import SectionHero from './SectionHero.vue';

const companyUpdates = ref(true);
const isLoginDialogVisible = ref(false);
</script>

<style scoped>
.account-settings-page {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.settings-stack {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.settings-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  padding: 24px;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background-color: var(--bg-default);
}

.settings-copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.settings-copy h2 {
  margin: 0;
  font-size: 20px;
  color: var(--text-strong);
}

.settings-value {
  margin: 0;
  font-size: 16px;
  color: var(--text-strong);
}

.settings-description {
  margin: 0;
  font-size: 14px;
  line-height: 22px;
  color: var(--text-subtle);
}

.settings-actions {
  display: flex;
  align-items: center;
  width: 100%;
}

.subscription-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  font-size: 14px;
  color: var(--text-default);
  width: 100%;
}

.danger-action-btn {
  color: #ef4444 !important;
  border-color: #ef4444 !important;
}

@media (max-width: 768px) {
  .account-settings-page {
    gap: 28px;
  }

  .settings-stack {
    gap: 24px;
  }

  .settings-card {
    padding: 20px;
  }

  .settings-actions :deep(.p-button) {
    width: 100%;
  }
}
</style>
