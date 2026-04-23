<template>
  <Dialog
    :visible="visible"
    modal
    :closable="false"
    :draggable="false"
    :style="{ width: 'min(calc(100% - 32px), 34rem)' }"
    class="login-otp-dialog"
    @update:visible="emit('update:visible', $event)"
  >
    <template #container>
      <div class="login-modal">
        <div class="login-modal-header">
          <h2>Log in to your profile</h2>
          <Button text rounded severity="secondary" class="login-modal-close" aria-label="Close login modal" @click="closeDialog">
            <template #icon>
              <AppIcon name="times" />
            </template>
          </Button>
        </div>

        <div class="login-modal-content">
          <template v-if="currentStep === 'request'">
            <p class="login-modal-intro">
              {{
                selectedMethod === 'email'
                  ? 'Enter your email to receive a one-time password (OTP) for verification.'
                  : 'Enter your mobile number to receive a one-time password (OTP) by SMS for verification.'
              }}
            </p>

            <div class="login-input-group">
              <label :for="selectedMethod === 'email' ? 'otp-email' : 'otp-phone'" class="login-field-label">
                {{ selectedMethod === 'email' ? 'Email' : 'Mobile number' }}
              </label>

              <InputText
                v-if="selectedMethod === 'email'"
                id="otp-email"
                :ref="setContactInputRef"
                v-model="email"
                type="email"
                placeholder="Email"
                class="login-input"
                :class="{ 'login-input-error': formErrors.contact }"
                :aria-invalid="formErrors.contact ? 'true' : 'false'"
                :aria-describedby="formErrors.contact ? 'otp-contact-error' : undefined"
              />

              <InputMask
                v-else
                id="otp-phone"
                :ref="setContactInputRef"
                v-model="phone"
                mask="+9 (999) 999-9999"
                placeholder="+1 (555) 123-4567"
                class="login-input"
                :class="{ 'login-input-error': formErrors.contact }"
                :aria-invalid="formErrors.contact ? 'true' : 'false'"
                :aria-describedby="formErrors.contact ? 'otp-contact-error' : undefined"
              />

              <small v-if="formErrors.contact" id="otp-contact-error" class="login-error-text" role="alert">{{ formErrors.contact }}</small>
            </div>

            <Button
              type="button"
              :label="selectedMethod === 'email' ? 'Use SMS login instead' : 'Use email login instead'"
              :icon="selectedMethod === 'email' ? 'phone' : 'mail'"
              severity="secondary"
              outlined
              class="login-method-btn"
              @click="toggleMethod"
            >
              <template #icon>
                <AppIcon :name="selectedMethod === 'email' ? 'phone' : 'mail'" />
              </template>
            </Button>

            <div class="login-consent-list">
              <div class="login-consent-item" :class="{ 'login-consent-item-error': formErrors.marketingConsent }">
                <Checkbox
                  v-model="marketingConsent"
                  inputId="marketing-consent"
                  :binary="true"
                  :aria-invalid="formErrors.marketingConsent ? 'true' : 'false'"
                  :aria-describedby="formErrors.marketingConsent ? 'marketing-consent-error' : undefined"
                />
                <div class="login-consent-copy">
                  <label for="marketing-consent">
                    I consent to receive {{ selectedMethod === 'email' ? 'email' : 'SMS' }} updates from &lt;customer name&gt; about insights and career opportunities
                  </label>
                  <small v-if="formErrors.marketingConsent" id="marketing-consent-error" class="login-error-text" role="alert">{{ formErrors.marketingConsent }}</small>
                </div>
              </div>

              <div class="login-consent-item" :class="{ 'login-consent-item-error': formErrors.retentionConsent }">
                <Checkbox
                  v-model="retentionConsent"
                  inputId="retention-consent"
                  :binary="true"
                  :aria-invalid="formErrors.retentionConsent ? 'true' : 'false'"
                  :aria-describedby="formErrors.retentionConsent ? 'retention-consent-error' : undefined"
                />
                <div class="login-consent-copy">
                  <label for="retention-consent">
                    I agree to &lt;customer name&gt; retaining my personal information, including sensitive data, for up to five years for future employment opportunities.
                  </label>
                  <small v-if="formErrors.retentionConsent" id="retention-consent-error" class="login-error-text" role="alert">{{ formErrors.retentionConsent }}</small>
                </div>
              </div>
            </div>

            <Button
              :label="selectedMethod === 'email' ? 'Send email OTP' : 'Send SMS OTP'"
              severity="primary"
              class="login-send-btn"
              @click="submitRequestStep"
            />
          </template>

          <template v-else-if="currentStep === 'verify'">
            <div class="login-step-header">
              <p class="login-modal-intro">
                {{
                  selectedMethod === 'email'
                    ? `We've sent a 6-digit verification code to ${deliveryLabel}.`
                    : `We've sent a 6-digit verification code by SMS to ${deliveryLabel}.`
                }}
              </p>
              <p class="login-step-hint">Use demo code <strong>123456</strong> to continue.</p>
            </div>

            <div class="login-input-group">
              <label id="otp-code-label" class="login-field-label">Verification code</label>
              <div class="login-otp-row">
                <InputText
                  v-for="(_, index) in otpDigits"
                  :key="index"
                  :ref="(el) => setOtpInputRef(el, index)"
                  :inputId="`otp-digit-${index + 1}`"
                  v-model="otpDigits[index]"
                  inputmode="numeric"
                  maxlength="1"
                  autocomplete="one-time-code"
                  class="login-otp-input"
                  :class="{ 'login-otp-input-error': verifyErrors.otpCode }"
                  :aria-label="`Verification code digit ${index + 1} of ${otpDigits.length}`"
                  :aria-labelledby="'otp-code-label'"
                  :aria-invalid="verifyErrors.otpCode ? 'true' : 'false'"
                  :aria-describedby="verifyErrors.otpCode ? 'otp-code-error' : undefined"
                  @input="handleOtpInput(index, $event)"
                  @keydown="handleOtpKeydown(index, $event)"
                  @paste="handleOtpPaste"
                />
              </div>
              <small v-if="verifyErrors.otpCode" id="otp-code-error" class="login-error-text" role="alert">{{ verifyErrors.otpCode }}</small>
            </div>

            <div class="login-resend-row">
              <Button
                type="button"
                :label="selectedMethod === 'email' ? 'Use SMS login instead' : 'Use email login instead'"
                severity="secondary"
                outlined
                class="login-method-btn"
                @click="goBackToRequestStep"
              >
                <template #icon>
                  <AppIcon :name="selectedMethod === 'email' ? 'phone' : 'mail'" />
                </template>
              </Button>

              <button type="button" class="login-resend-btn" :disabled="resendTimer > 0" @click="resendCode">
                {{ resendTimer > 0 ? `Resend code in ${formattedTimer}` : 'Resend code' }}
              </button>
            </div>

            <small v-if="verifyErrors.general" class="login-error-text" role="alert">{{ verifyErrors.general }}</small>
            <small v-if="successMessage" class="login-success-text" role="status">{{ successMessage }}</small>

            <Button label="Verify and continue" severity="primary" class="login-send-btn" @click="submitVerifyStep" />
          </template>

          <template v-else-if="currentStep === 'email-association'">
            <div class="login-step-header">
              <h2 class="login-association-title">Associate an email address</h2>
              <p class="login-modal-intro">
                To complete your profile, please provide an email address where you'd like to receive job updates and notifications.
              </p>
            </div>

            <div class="login-input-group">
              <label for="associated-email" class="login-field-label">Email address</label>
              <InputText
                id="associated-email"
                v-model="associatedEmail"
                type="email"
                placeholder="email@example.com"
                class="login-input"
                :class="{ 'login-input-error': emailAssociationErrors.email }"
                :aria-invalid="emailAssociationErrors.email ? 'true' : 'false'"
                :aria-describedby="emailAssociationErrors.email ? 'associated-email-error' : undefined"
              />
              <small v-if="emailAssociationErrors.email" id="associated-email-error" class="login-error-text" role="alert">
                {{ emailAssociationErrors.email }}
              </small>
            </div>

            <Button label="Complete profile" severity="primary" class="login-send-btn" @click="submitEmailAssociation" />
          </template>

          <template v-else-if="currentStep === 'email-selection'">
            <div class="login-step-header">
              <h2 class="login-association-title">Multiple profiles found</h2>
              <p class="login-modal-intro">
                We've found more than one email address associated with your mobile number. Which one would you like to use to sign in?
              </p>
            </div>

            <div class="login-email-list">
              <button
                v-for="option in selectableEmails"
                :key="option"
                type="button"
                class="login-email-option"
                @click="selectEmailForCompletion(option)"
              >
                <div class="login-email-option-content">
                  <span class="login-email-option-text">{{ obscureEmail(option) }}</span>
                  <AppIcon name="arrow-right" class="login-email-option-icon" />
                </div>
              </button>
            </div>
          </template>

          <template v-else-if="currentStep === 'email-completion'">
            <div class="login-step-header">
              <h2 class="login-association-title">Verify your email</h2>
              <p class="login-modal-intro">
                To continue, please enter the full email address for: <strong>{{ obscureEmail(selectedEmailToComplete) }}</strong>
              </p>
            </div>

            <div class="login-input-group">
              <label for="completion-email" class="login-field-label">Full email address</label>
              <InputText
                id="completion-email"
                v-model="completionEmail"
                type="email"
                placeholder="email@example.com"
                class="login-input"
                :class="{ 'login-input-error': emailCompletionErrors.email }"
                :aria-invalid="emailCompletionErrors.email ? 'true' : 'false'"
                :aria-describedby="emailCompletionErrors.email ? 'completion-email-error' : undefined"
              />
              <small v-if="emailCompletionErrors.email" id="completion-email-error" class="login-error-text" role="alert">
                {{ emailCompletionErrors.email }}
              </small>
            </div>

            <Button label="Verify and continue" severity="primary" class="login-send-btn" @click="submitEmailCompletion" />
          </template>

          <template v-else-if="currentStep === 'success'">
            <div class="login-success-screen">
              <div class="login-success-icon-wrapper">
                <AppIcon name="check" />
              </div>
              <h2 class="login-association-title">Success!</h2>
              <p class="login-modal-intro" style="text-align: center;">
                {{ successMessage }}
              </p>
              <Button label="Great, thanks!" severity="primary" class="login-send-btn" @click="closeDialog" />
            </div>
          </template>

          <div class="login-social-section">
            <div class="login-divider-row">
              <span class="login-divider-line"></span>
              <span class="login-divider-text">or use your social account</span>
              <span class="login-divider-line"></span>
            </div>

            <div class="login-social-list">
              <button type="button" class="login-social-btn login-social-linkedin" aria-label="Continue with LinkedIn">in</button>
              <button type="button" class="login-social-btn login-social-facebook" aria-label="Continue with Facebook">f</button>
              <button type="button" class="login-social-btn login-social-google" aria-label="Continue with Google">G</button>
            </div>
          </div>

          <div class="login-legal-links">
            <a href="#" @click.prevent>Terms Of Use</a>
            <span class="login-legal-divider"></span>
            <a href="#" @click.prevent>Privacy Policy</a>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import InputMask from 'primevue/inputmask';
import InputText from 'primevue/inputtext';
import AppIcon from './AppIcon.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible']);

const currentStep = ref('request');
const selectedMethod = ref('email');
const email = ref('');
const phone = ref('');
const marketingConsent = ref(false);
const retentionConsent = ref(false);
const otpDigits = ref(['', '', '', '', '', '']);
const otpInputRefs = ref([]);
const contactInputRef = ref(null);
const resendTimer = ref(59);
const successMessage = ref('');
const formErrors = ref({
  contact: '',
  marketingConsent: '',
  retentionConsent: ''
});
const verifyErrors = ref({
  otpCode: '',
  general: ''
});
const associatedEmail = ref('');
const emailAssociationErrors = ref({
  email: ''
});
const selectableEmails = ref([]);
const selectedEmailFromList = ref('');
const selectedEmailToComplete = ref('');
const completionEmail = ref('');
const emailCompletionErrors = ref({
  email: ''
});

let countdownInterval = null;

const deliveryLabel = computed(() => (selectedMethod.value === 'email' ? email.value.trim() : phone.value.trim()));
const formattedTimer = computed(() => `00:${String(resendTimer.value).padStart(2, '0')}`);
const otpCode = computed(() => otpDigits.value.join(''));

const clearCountdown = () => {
  if (!countdownInterval) return;
  clearInterval(countdownInterval);
  countdownInterval = null;
};

const startCountdown = () => {
  clearCountdown();
  resendTimer.value = 59;
  countdownInterval = setInterval(() => {
    if (resendTimer.value <= 0) {
      clearCountdown();
      return;
    }

    resendTimer.value -= 1;
  }, 1000);
};

const resetState = () => {
  currentStep.value = 'request';
  selectedMethod.value = 'email';
  email.value = '';
  phone.value = '';
  associatedEmail.value = '';
  emailAssociationErrors.value = {
    email: ''
  };
  selectableEmails.value = [];
  selectedEmailFromList.value = '';
  selectedEmailToComplete.value = '';
  completionEmail.value = '';
  emailCompletionErrors.value = {
    email: ''
  };
  marketingConsent.value = false;
  retentionConsent.value = false;
  otpDigits.value = ['', '', '', '', '', ''];
  otpInputRefs.value = [];
  successMessage.value = '';
  formErrors.value = {
    contact: '',
    marketingConsent: '',
    retentionConsent: ''
  };
  verifyErrors.value = {
    otpCode: '',
    general: ''
  };
  clearCountdown();
  resendTimer.value = 59;
};

const closeDialog = () => {
  emit('update:visible', false);
};

const focusElementById = (id) => {
  document.getElementById(id)?.focus?.();
};

const setContactInputRef = (element) => {
  const input = element?.$el?.querySelector?.('input') ?? element?.input ?? element;
  contactInputRef.value = input || null;
};

const toggleMethod = () => {
  selectedMethod.value = selectedMethod.value === 'email' ? 'sms' : 'email';
  formErrors.value.contact = '';
  verifyErrors.value.general = '';
};

const goBackToRequestStep = () => {
  toggleMethod();
  currentStep.value = 'request';
  otpDigits.value = ['', '', '', '', '', ''];
  verifyErrors.value = {
    otpCode: '',
    general: ''
  };
  successMessage.value = '';
  clearCountdown();
};

const validateContact = () => {
  formErrors.value.contact = '';

  if (selectedMethod.value === 'email') {
    const isValidEmail = /\S+@\S+\.\S+/.test(email.value.trim());
    if (!isValidEmail) {
      formErrors.value.contact = 'Enter a valid email address.';
    }
    return;
  }

  const digits = phone.value.replace(/\D/g, '');
  if (digits.length < 11) {
    formErrors.value.contact = 'Enter a valid mobile number.';
  }
};

const validateConsents = () => {
  formErrors.value.marketingConsent = marketingConsent.value ? '' : `Please consent to receive ${selectedMethod.value === 'email' ? 'email' : 'SMS'} updates.`;
  formErrors.value.retentionConsent = retentionConsent.value ? '' : 'Please agree to the data retention policy.';
};

const submitRequestStep = () => {
  validateContact();
  validateConsents();

  const hasErrors = Object.values(formErrors.value).some(Boolean);
  if (hasErrors) {
    nextTick(() => {
      if (formErrors.value.contact) {
        contactInputRef.value?.focus?.();
        return;
      }
      if (formErrors.value.marketingConsent) {
        focusElementById('marketing-consent');
        return;
      }
      if (formErrors.value.retentionConsent) {
        focusElementById('retention-consent');
      }
    });
    return;
  }

  currentStep.value = 'verify';
  otpDigits.value = ['', '', '', '', '', ''];
  verifyErrors.value = {
    otpCode: '',
    general: ''
  };
  successMessage.value = '';
  startCountdown();
  requestAnimationFrame(() => focusOtpInput(0));
};

const submitVerifyStep = () => {
  verifyErrors.value = {
    otpCode: '',
    general: ''
  };
  successMessage.value = '';

  if (otpCode.value.trim().length !== 6) {
    verifyErrors.value.otpCode = 'Enter the full 6-digit verification code.';
  } else if (otpCode.value.trim() !== '123456') {
    verifyErrors.value.otpCode = 'Enter the correct 6-digit code. Try 123456 for the demo.';
  }

  if (verifyErrors.value.otpCode) {
    verifyErrors.value.general = 'We could not verify your code. Please check it and try again.';
    nextTick(() => focusOtpInput(0));
    return;
  }

  // Handle special case: new profile association for SMS users
  if (selectedMethod.value === 'sms' && otpCode.value.trim() === '123456') {
    const rawDigits = phone.value.replace(/\D/g, '');
    
    // Multiple emails conflict case
    if (rawDigits === '15551234567') {
      selectableEmails.value = ['alex.m@example.com', 'a.morgan@work.com'];
      currentStep.value = 'email-selection';
      return;
    }
    
    currentStep.value = 'email-association';
    return;
  }

  successMessage.value = 'Verification successful. You are now signed in.';
  clearCountdown();
  currentStep.value = 'success';
};

const obscureEmail = (email) => {
  if (!email) return '';
  const [localPart, domain] = email.split('@');
  if (!domain) return email;

  const obscuredLocal = localPart.slice(0, 3) + '_____';
  const domainParts = domain.split('.');
  const domainName = domainParts[0];
  const obscuredDomainName = domainName.slice(0, 2) + '__';
  
  return `${obscuredLocal}@${obscuredDomainName}.`;
};

const selectEmailForCompletion = (chosenEmail) => {
  selectedEmailToComplete.value = chosenEmail;
  completionEmail.value = '';
  emailCompletionErrors.value.email = '';
  currentStep.value = 'email-completion';
};

const submitEmailCompletion = () => {
  emailCompletionErrors.value.email = '';

  if (completionEmail.value.trim().toLowerCase() !== selectedEmailToComplete.value.toLowerCase()) {
    emailCompletionErrors.value.email = 'The email address you entered does not match.';
    return;
  }

  successMessage.value = `Verification successful. You've signed in using ${selectedEmailToComplete.value}.`;
  clearCountdown();
  currentStep.value = 'success';
};

const submitEmailAssociation = () => {
  emailAssociationErrors.value.email = '';

  const isValidEmail = /\S+@\S+\.\S+/.test(associatedEmail.value.trim());
  if (!isValidEmail) {
    emailAssociationErrors.value.email = 'Enter a valid email address.';
    return;
  }

  successMessage.value = 'Verification successful. Your account is now associated and you are signed in.';
  clearCountdown();
  currentStep.value = 'success';
};

const resendCode = () => {
  verifyErrors.value.otpCode = '';
  verifyErrors.value.general = '';
  successMessage.value = 'A fresh verification code has been sent.';
  otpDigits.value = ['', '', '', '', '', ''];
  startCountdown();
  requestAnimationFrame(() => focusOtpInput(0));
};

const setOtpInputRef = (element, index) => {
  // PrimeVue InputText renders as a plain <input>, so element.$el IS the DOM
  // input element. Do NOT call querySelector('input') on it — that returns null
  // because an <input> has no children — which caused focus() to silently fail.
  const input = element?.$el ?? element?.input ?? element;
  otpInputRefs.value[index] = (input instanceof HTMLElement) ? input : null;
};

const focusOtpInput = (index) => {
  const el = otpInputRefs.value[index];
  if (el instanceof HTMLElement) {
    el.focus();
    el.select();
  }
};

const handleOtpInput = (index, event) => {
  const rawValue = event?.target?.value ?? otpDigits.value[index] ?? '';
  const sanitized = rawValue.replace(/\D/g, '').slice(-1);
  otpDigits.value[index] = sanitized;
  verifyErrors.value.otpCode = '';
  verifyErrors.value.general = '';

  if (sanitized && index < otpDigits.value.length - 1) {
    nextTick(() => focusOtpInput(index + 1));
  }
};

const handleOtpKeydown = (index, event) => {
  // When a digit key is pressed on an already-filled box, clear it first so the
  // browser registers the new character and the @input handler fires (which
  // drives the auto-advance). Without this, maxlength="1" silently swallows the
  // keypress and focus never moves forward.
  if (/^\d$/.test(event.key) && otpDigits.value[index]) {
    otpDigits.value[index] = '';
  }

  if (event.key === 'Backspace') {
    if (otpDigits.value[index]) {
      // Clear the current box
      otpDigits.value[index] = '';
    } else if (index > 0) {
      // Box is empty — move back and clear the previous box
      focusOtpInput(index - 1);
    }
  }
  if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault();
    focusOtpInput(index - 1);
  }
  if (event.key === 'ArrowRight' && index < otpDigits.value.length - 1) {
    event.preventDefault();
    focusOtpInput(index + 1);
  }
};

const handleOtpPaste = (event) => {
  event.preventDefault();
  const pasted = event.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6) ?? '';
  if (!pasted) return;

  const nextDigits = ['', '', '', '', '', ''];
  pasted.split('').forEach((digit, index) => {
    nextDigits[index] = digit;
  });
  otpDigits.value = nextDigits;
  const nextIndex = Math.min(pasted.length, 5);
  requestAnimationFrame(() => focusOtpInput(nextIndex));
};

watch(
  () => props.visible,
  (isVisible) => {
  if (isVisible) {
    resetState();
    nextTick(() => {
      contactInputRef.value?.focus?.();
    });
    return;
  }

    clearCountdown();
  }
);

onBeforeUnmount(() => {
  clearCountdown();
});
</script>

<style scoped>
.login-modal {
  background: var(--bg-default);
  border-radius: 24px;
  overflow: hidden;
}

.login-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 28px 32px 12px;
}

.login-modal-header h2 {
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 600;
  color: #0d244c;
}

.login-modal-close {
  width: 2rem;
  height: 2rem;
  color: #777 !important;
  margin-top: -2px;
}

.login-modal-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 8px 32px 36px;
}

.login-modal-intro {
  margin: 0;
  max-width: 390px;
  font-size: 18px;
  line-height: 1.6;
  font-weight: 500;
  color: #0d244c;
}

.login-step-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.login-step-hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-subtle);
}

.login-association-title {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  font-weight: 600;
  color: #0d244c;
}

.login-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.login-field-label {
  font-size: 16px;
  line-height: 1.25;
  color: #4e4e4e;
}

.login-input :deep(.p-inputtext) {
  width: 100%;
}

.login-input :deep(.p-inputtext),
.login-input.p-inputtext {
  width: 100%;
  border-color: #bdbdbd;
  border-radius: 10px;
  padding: 11px 16px;
  color: #0d244c;
  box-shadow: none;
}

.login-input-error :deep(.p-inputtext),
.login-input-error.p-inputtext {
  border-color: #ef4444;
}

.login-otp-row {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
}

.login-otp-input :deep(.p-inputtext),
.login-otp-input.p-inputtext {
  width: 100%;
  min-height: 52px;
  border-color: #bdbdbd;
  border-radius: 12px;
  padding: 10px 0;
  font-size: 22px;
  line-height: 1;
  font-weight: 600;
  text-align: center;
  color: #0d244c;
  box-shadow: none;
}

.login-otp-input-error :deep(.p-inputtext),
.login-otp-input-error.p-inputtext {
  border-color: #ef4444;
}

.login-method-btn {
  width: 100%;
  justify-content: center;
  border-radius: 12px;
  font-weight: 600;
  gap: 10px;
}

.login-resend-btn {
  align-self: flex-start;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 500;
  color: var(--secondary-text);
  cursor: pointer;
}

.login-method-link:hover,
.login-resend-btn:hover:not(:disabled) {
  text-decoration: underline;
}

.login-resend-btn:disabled {
  color: var(--text-subtle);
  cursor: default;
}

.login-consent-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-consent-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.login-consent-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.login-consent-item label {
  font-size: 14px;
  line-height: 1.4;
  color: #4e4e4e;
  cursor: pointer;
}

.login-consent-item-error :deep(.p-checkbox-box) {
  border-color: #ef4444;
}

.login-error-text {
  font-size: 12px;
  line-height: 1.4;
  color: #ef4444;
}

.login-success-text {
  font-size: 12px;
  line-height: 1.4;
  color: #15803d;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.login-resend-row {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-send-btn {
  width: 100%;
  min-height: 48px;
  border-radius: 999px;
  font-size: 18px;
  font-weight: 600;
}

.login-social-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.login-divider-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.login-divider-line {
  flex: 1;
  height: 1px;
  background: #bdbdbd;
}

.login-divider-text {
  font-size: 16px;
  line-height: 1.25;
  color: #4e4e4e;
  white-space: nowrap;
}

.login-social-list {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.login-social-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 999px;
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  cursor: pointer;
}

.login-social-linkedin {
  background: #0077b5;
  font-size: 20px;
  font-weight: 600;
}

.login-social-facebook {
  background: #3b5998;
}

.login-social-google {
  background: #dd4b39;
}

.login-legal-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
}

.login-legal-links a {
  font-size: 14px;
  line-height: 1.6;
  color: #777;
  text-decoration: none;
}

.login-legal-divider {
  width: 1px;
  height: 24px;
  background: #777;
}

@media (max-width: 768px) {
  .login-modal-header {
    padding: 24px 24px 8px;
  }

  .login-modal-header h2 {
    font-size: 24px;
  }

  .login-modal-content {
    padding: 8px 24px 32px;
    gap: 20px;
  }

  .login-modal-intro {
    font-size: 16px;
    line-height: 1.5;
  }

  .login-resend-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .login-otp-row {
    gap: 8px;
  }

  .login-divider-row {
    gap: 10px;
  }

  .login-divider-text {
    font-size: 14px;
  }

  .login-social-list {
    gap: 16px;
  }

  .login-legal-links {
    gap: 20px;
  }
}

.login-success-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 16px 0 8px;
}

.login-success-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: #f0fdf4;
  color: #16a34a;
  border-radius: 50%;
  font-size: 40px;
}

.login-success-screen .login-association-title {
  text-align: center;
}

.login-email-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-email-option {
  width: 100%;
  padding: 16px 20px;
  background-color: var(--bg-default);
  border: 1px solid #bdbdbd;
  border-radius: 12px;
  color: #0d244c;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.login-email-option:hover {
  border-color: var(--primary-bg);
  background-color: #f0fdf9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(60, 109, 104, 0.08);
}

.login-email-option-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.login-email-option-icon {
  font-size: 14px;
  color: var(--text-subtle);
  transition: transform 0.2s ease, color 0.2s ease;
}

.login-email-option:hover .login-email-option-icon {
  color: var(--primary-bg);
  transform: translateX(4px);
}

@media (max-width: 480px) {
  .login-modal-header {
    padding: 20px 20px 8px;
  }

  .login-modal-content {
    padding: 8px 20px 24px;
    gap: 18px;
  }

  .login-modal-intro {
    font-size: 15px;
  }

  .login-otp-row {
    gap: 6px;
  }

  .login-otp-input :deep(.p-inputtext),
  .login-otp-input.p-inputtext {
    min-height: 44px;
    font-size: 18px;
  }

  .login-legal-links {
    flex-direction: column;
    gap: 8px;
  }

  .login-legal-divider {
    display: none;
  }

  .login-social-btn {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }
}
</style>
