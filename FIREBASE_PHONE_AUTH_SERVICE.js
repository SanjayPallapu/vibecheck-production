// Firebase Phone Authentication Service
// Complete deployment-ready implementation for VibeCheck

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
  signOut
} from 'firebase/auth';

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

class PhoneAuthService {
  constructor() {
    this.recaptchaVerifier = null;
    this.confirmationResult = null;
  }

  /**
   * Initialize reCAPTCHA verifier
   */
  async initializeRecaptcha(containerId = 'recaptcha-container') {
    try {
      if (!this.recaptchaVerifier) {
        this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
          size: 'normal',
          callback: () => console.log('reCAPTCHA verified'),
          'expired-callback': () => this.clearRecaptcha(),
          'error-callback': () => this.clearRecaptcha()
        });
        await this.recaptchaVerifier.render();
      }
      return this.recaptchaVerifier;
    } catch (error) {
      console.error('reCAPTCHA initialization error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Send OTP to phone number
   */
  async sendOTP(phoneNumber) {
    try {
      if (!phoneNumber) throw new Error('Phone number is required');
      if (!this.validatePhoneNumber(phoneNumber)) {
        throw new Error('Invalid phone number format');
      }

      if (!this.recaptchaVerifier) {
        await this.initializeRecaptcha();
      }

      this.confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        this.recaptchaVerifier
      );

      return this.confirmationResult;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Verify OTP and authenticate user
   */
  async verifyOTP(otp) {
    try {
      if (!otp) throw new Error('OTP is required');
      if (!this.confirmationResult) {
        throw new Error('No OTP sent. Request OTP first.');
      }
      if (!/^\d{6}$/.test(otp)) {
        throw new Error('OTP must be 6 digits');
      }

      const result = await this.confirmationResult.confirm(otp);
      return result;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser() {
    return auth.currentUser;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(updates) {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('No authenticated user');
      await updateProfile(user, updates);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Sign out
   */
  async signOut() {
    try {
      await signOut(auth);
      this.clearRecaptcha();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Clear reCAPTCHA
   */
  clearRecaptcha() {
    this.recaptchaVerifier = null;
    this.confirmationResult = null;
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }

  /**
   * Handle Firebase errors
   */
  handleError(error) {
    let message = 'An error occurred';

    if (error.code) {
      switch (error.code) {
        case 'auth/invalid-phone-number':
          message = 'Invalid phone number. Please check and try again.';
          break;
        case 'auth/missing-phone-number':
          message = 'Phone number is required';
          break;
        case 'auth/quota-exceeded':
          message = 'Too many requests. Please try again later.';
          break;
        case 'auth/user-disabled':
          message = 'This user account has been disabled.';
          break;
        case 'auth/invalid-verification-code':
          message = 'Invalid verification code. Please try again.';
          break;
        case 'auth/session-expired':
          message = 'Verification session expired. Please request a new code.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many failed attempts. Please try again later.';
          break;
        default:
          message = error.message || message;
      }
    }

    const customError = new Error(message);
    customError.code = error.code;
    customError.originalError = error;
    return customError;
  }

  /**
   * Setup auth state listener
   */
  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  }
}

export const phoneAuthService = new PhoneAuthService();
export default phoneAuthService;
