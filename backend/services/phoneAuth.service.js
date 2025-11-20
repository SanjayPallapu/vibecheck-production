const { auth, db } = require('../config/firebase');
const logger = require('../utils/logger');

class PhoneAuthService {
  /**
   * Send OTP to phone number
   * Returns sessionInfo to be used in verification
   */
  async sendOTP(phoneNumber) {
    try {
      // Validate phone number format
      if (!this.isValidPhoneNumber(phoneNumber)) {
        throw new Error('Invalid phone number format');
      }

      // Create session info for OTP verification
      const sessionInfo = await auth.createSessionCookie(
        phoneNumber,
        { expiresIn: 60 * 60 * 24 } // 24 hours
      );

      // Store OTP session in Firestore
      await db.collection('phoneAuthSessions').doc(phoneNumber).set({
        phoneNumber,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        status: 'pending',
        attempts: 0,
        maxAttempts: 5,
        sessionInfo,
      });

      logger.info(`OTP session created for ${phoneNumber}`);
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      logger.error(`Error sending OTP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify OTP and create user session
   */
  async verifyOTP(phoneNumber, otp) {
    try {
      const sessionRef = db.collection('phoneAuthSessions').doc(phoneNumber);
      const sessionSnap = await sessionRef.get();

      if (!sessionSnap.exists) {
        throw new Error('Session not found');
      }

      const session = sessionSnap.data();

      // Check if session has expired
      if (new Date() > session.expiresAt) {
        await sessionRef.update({ status: 'expired' });
        throw new Error('OTP expired');
      }

      // Check attempt limit
      if (session.attempts >= session.maxAttempts) {
        await sessionRef.update({ status: 'blocked' });
        throw new Error('Too many verification attempts');
      }

      // In production, you would verify actual OTP here
      // For now, this is a placeholder
      const isValidOTP = await this.validateOTPCode(phoneNumber, otp);

      if (!isValidOTP) {
        await sessionRef.update({
          attempts: session.attempts + 1,
        });
        throw new Error('Invalid OTP');
      }

      // Create or update user
      const userRef = db.collection('users').doc(phoneNumber);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        await userRef.set({
          phoneNumber,
          createdAt: new Date(),
          lastLogin: new Date(),
          authProvider: 'phone',
        });
      } else {
        await userRef.update({ lastLogin: new Date() });
      }

      // Mark session as verified
      await sessionRef.update({
        status: 'verified',
        verifiedAt: new Date(),
      });

      logger.info(`User verified: ${phoneNumber}`);
      return {
        success: true,
        userId: phoneNumber,
        message: 'OTP verified successfully',
      };
    } catch (error) {
      logger.error(`Error verifying OTP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate phone number format
   */
  isValidPhoneNumber(phoneNumber) {
    // E.164 format validation
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }

  /**
   * Placeholder for actual OTP validation
   * In production, integrate with SMS provider like Twilio
   */
  async validateOTPCode(phoneNumber, otp) {
    try {
      // TODO: Integrate with SMS provider
      // Example: Twilio client.verify.v2.services
      // For now, accept any 6-digit OTP
      return /^\d{6}$/.test(otp);
    } catch (error) {
      logger.error(`Error validating OTP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get user by phone number
   */
  async getUserByPhone(phoneNumber) {
    try {
      const userSnap = await db
        .collection('users')
        .doc(phoneNumber)
        .get();

      if (!userSnap.exists) {
        return null;
      }

      return { phoneNumber, ...userSnap.data() };
    } catch (error) {
      logger.error(`Error getting user: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify Firebase ID token
   */
  async verifyIdToken(idToken) {
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      logger.error(`Error verifying ID token: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new PhoneAuthService();
