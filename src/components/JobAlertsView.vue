<template>
  <section class="job-alerts-page">
    <SectionHero
      eyebrow="Job Alerts"
      title="Job alerts"
      subtitle="Create alerts for the roles you're interested in and we’ll email you when a new opening matches those search criteria."
    />

    <section class="alerts-table-card">
      <div class="alerts-table-header alerts-grid">
        <span>Alert Name</span>
        <span>Email Frequency</span>
        <span>Actions</span>
      </div>

      <div
        v-for="(alert, index) in alerts"
        :key="alert.id"
        class="alerts-row alerts-grid"
        :class="{ 'alerts-row-last': index === alerts.length - 1 }"
      >
        <div class="alert-name-cell">
          <span class="mobile-field-label">Alert Name</span>
          <template v-if="editingAlertId === alert.id">
            <div class="alert-edit-row">
              <InputText v-model="editingName" class="alert-name-input" />
              <Button text rounded severity="secondary" class="edit-state-btn confirm-btn" aria-label="Save alert name" @click="saveAlertName(alert.id)">
                <template #icon>
                  <AppIcon name="check" />
                </template>
              </Button>
              <Button text rounded severity="secondary" class="edit-state-btn cancel-btn" aria-label="Cancel alert editing" @click="cancelEdit">
                <template #icon>
                  <AppIcon name="times" />
                </template>
              </Button>
            </div>
          </template>
          <template v-else>
            <div class="alert-name-row">
              <Button text rounded severity="secondary" class="edit-alert-btn" aria-label="Edit alert name" @click="startEdit(alert)">
                <template #icon>
                  <AppIcon name="pencil" />
                </template>
              </Button>
              <span class="alert-name">{{ alert.name }}</span>
            </div>
          </template>
        </div>

        <div class="alert-frequency-cell">
          <span class="mobile-field-label">Email Frequency</span>
          <Dropdown
            v-model="alert.frequency"
            :options="frequencyOptions"
            optionLabel="label"
            optionValue="value"
            class="frequency-dropdown"
          />
        </div>

        <div class="alert-actions-cell">
          <span class="mobile-field-label">Actions</span>
          <Button label="View results" severity="secondary" outlined class="alert-action-button" @click.prevent />
          <Button label="Delete alert" severity="secondary" outlined class="alert-action-button alert-delete-button" @click.prevent />
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import AppIcon from './AppIcon.vue';
import SectionHero from './SectionHero.vue';

const frequencyOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' }
];

const alerts = ref([
  { id: 1, name: 'Product Experience', frequency: 'weekly' },
  { id: 2, name: 'Senior Product Designer', frequency: 'weekly' },
  { id: 3, name: 'UX Designer(Independent Contractor)', frequency: 'weekly' }
]);

const editingAlertId = ref(null);
const editingName = ref('');

const startEdit = (alert) => {
  editingAlertId.value = alert.id;
  editingName.value = alert.name;
};

const cancelEdit = () => {
  editingAlertId.value = null;
  editingName.value = '';
};

const saveAlertName = (alertId) => {
  const nextName = editingName.value.trim();
  if (!nextName) return;

  const target = alerts.value.find((alert) => alert.id === alertId);
  if (target) {
    target.name = nextName;
  }

  cancelEdit();
};
</script>

<style scoped>
.job-alerts-page {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.alerts-table-card {
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background-color: var(--bg-default);
  padding: 8px 24px;
}

.alerts-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(180px, 0.9fr) minmax(220px, 1fr);
  gap: 24px;
  align-items: center;
}

.alerts-table-header {
  min-height: 60px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-strong);
}

.alerts-row {
  min-height: 64px;
  padding: 16px 0;
  border-top: 1px solid var(--border-color);
}

.alerts-row-last {
  border-bottom: none;
}

.alert-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
}

.alert-name {
  font-size: 15px;
  color: var(--text-strong);
}

.alert-name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.alert-edit-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.alert-name-input {
  flex: 1;
  min-width: 0;
  max-width: 420px;
}

.edit-alert-btn {
  width: 28px;
  height: 28px;
  color: var(--secondary-text) !important;
}

.edit-state-btn {
  width: 28px;
  height: 28px;
}

.confirm-btn {
  color: var(--text-strong) !important;
}

.cancel-btn {
  color: #ef4444 !important;
}

.frequency-dropdown {
  max-width: 144px;
}

.alert-actions-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.mobile-field-label {
  display: none;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-subtle);
}

@media (max-width: 768px) {
  .job-alerts-page {
    gap: 28px;
  }

  .alerts-table-card {
    padding: 0;
    border: none;
    background: transparent;
  }

  .alerts-table-header {
    display: none;
  }

  .alerts-row {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 18px 16px;
    margin-bottom: 12px;
    border: 1px solid var(--border-color);
    border-radius: 14px;
    background: var(--bg-default);
  }

  .mobile-field-label {
    display: block;
  }

  .alert-name-cell,
  .alert-frequency-cell,
  .alert-actions-cell {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
  }

  .alert-name-cell {
    gap: 10px;
    align-items: stretch;
  }

  .alert-name {
    font-size: 20px;
    line-height: 1.3;
    font-weight: 600;
    text-align: left;
  }

  .edit-alert-btn {
    width: 36px;
    height: 36px;
    border: 1px solid var(--border-color);
    border-radius: 999px;
    background: #fff;
    flex: 0 0 auto;
  }

  .alert-frequency-cell {
    gap: 10px;
    align-items: stretch;
  }

  .alert-edit-row {
    flex-wrap: wrap;
    width: 100%;
  }

  .alert-name-input {
    max-width: none;
    flex: 1 1 100%;
  }

  .frequency-dropdown {
    width: 100%;
    max-width: none;
  }

  .alert-actions-cell {
    align-items: stretch;
    gap: 12px;
  }

  .alert-action-button {
    width: 100%;
  }
}

.alert-delete-button {
  color: #ef4444 !important;
  border-color: #ef4444 !important;
}
</style>
