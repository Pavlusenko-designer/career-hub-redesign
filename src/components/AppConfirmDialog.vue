<template>
  <Dialog
    :visible="visible"
    modal
    :draggable="false"
    :closable="false"
    :style="{ width: 'min(560px, calc(100vw - 32px))' }"
    :breakpoints="{ '640px': 'calc(100vw - 32px)' }"
    class="app-confirm-dialog"
    @update:visible="emit('update:visible', $event)"
  >
    <template #container>
      <div class="confirm-modal" role="alertdialog" :aria-labelledby="titleId" :aria-describedby="messageId">
        <div class="confirm-modal-header">
          <div class="confirm-modal-title-row">
            <i v-if="showIcon" :class="iconClass" class="confirm-modal-warning-icon" aria-hidden="true"></i>
            <h2 :id="titleId" class="confirm-modal-title">{{ title }}</h2>
          </div>
          <button type="button" class="confirm-modal-close" aria-label="Close dialog" @click="onCancel">
            <AppIcon name="times" />
          </button>
        </div>

        <div class="confirm-modal-body">
          <p :id="messageId" class="confirm-modal-message">
            <slot>{{ message }}</slot>
          </p>
        </div>

        <div class="confirm-modal-footer">
          <Button :label="cancelLabel" text class="confirm-modal-btn-cancel" @click="onCancel" />
          <Button :label="confirmLabel" severity="primary" class="confirm-modal-btn-confirm" @click="onConfirm" />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import AppIcon from './AppIcon.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  confirmLabel: {
    type: String,
    default: 'Confirm'
  },
  cancelLabel: {
    type: String,
    default: 'Cancel'
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'danger', 'warning'].includes(value)
  },
  icon: {
    type: String,
    default: ''
  },
  showIcon: {
    type: Boolean,
    default: null
  }
});

const emit = defineEmits(['update:visible', 'confirm', 'cancel']);

const titleId = `confirm-title-${Math.random().toString(36).slice(2, 9)}`;
const messageId = `confirm-message-${Math.random().toString(36).slice(2, 9)}`;

const shouldShowIcon = computed(() => {
  if (props.showIcon != null) return props.showIcon;
  return props.variant === 'warning' || props.variant === 'danger';
});

const showIcon = shouldShowIcon;

const iconClass = computed(() => {
  if (props.icon) return props.icon;
  if (props.variant === 'warning' || props.variant === 'danger') return 'pi pi-exclamation-triangle';
  return 'pi pi-info-circle';
});

const onCancel = () => {
  emit('update:visible', false);
  emit('cancel');
};

const onConfirm = () => {
  emit('confirm');
};
</script>

<style scoped>
.confirm-modal {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background: #fff;
  overflow: hidden;
}

.confirm-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.confirm-modal-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.confirm-modal-warning-icon {
  flex-shrink: 0;
  font-size: 22px;
  line-height: 1;
  color: #e37643;
}

.confirm-modal-title {
  margin: 0;
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
  color: #374151;
}

.confirm-modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #374151;
  cursor: pointer;
}

.confirm-modal-close:hover {
  background: #f3f4f6;
}

.confirm-modal-close:focus-visible {
  outline: 3px solid #0f766e;
  outline-offset: 2px;
}

.confirm-modal-body {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.confirm-modal-message {
  margin: 0;
  font-size: 15px;
  line-height: 24px;
  color: #4b5563;
}

.confirm-modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
}

.confirm-modal-btn-cancel {
  min-height: 40px;
  padding: 8px 16px !important;
  color: #374151 !important;
  font-size: 15px !important;
  font-weight: 500 !important;
}

.confirm-modal-btn-cancel:hover {
  background: #f3f4f6 !important;
}

.confirm-modal-btn-confirm {
  min-height: 40px;
  padding: 8px 24px !important;
  border-radius: 999px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
}

@media (max-width: 560px) {
  .confirm-modal-header,
  .confirm-modal-body,
  .confirm-modal-footer {
    padding-left: 20px;
    padding-right: 20px;
  }

  .confirm-modal-footer {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .confirm-modal-btn-confirm {
    margin-left: auto;
  }
}
</style>
