import { reactive } from 'vue';

export const profileNavigation = reactive({
  hasUnsavedChanges: false,
  isLeaveDialogVisible: false,
  pendingRoute: null,
  discardAllChanges: null,
  isConfirmingLeave: false
});
