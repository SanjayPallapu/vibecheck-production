const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 10000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

const otpStore = new Map();
const OTP_VALIDITY = 5 * 60 * 1000;
const MAX_ATTEMPTS = 3;
const OTP_LENGTH = 6;

function generateOTP() {
  return Math.floor(Math.pow(10, OTP_LENGTH - 1) + Math.random() * (Math.pow(10, OTP_LENGTH) - Math.pow(10, OTP_LENGTH - 1))).toString();
}

function validatePhone(phone) {
  return /^\d{10}$/.test(phone);
}

function validateOTP(otp) {
  return /^\d{6}$/.test(otp);
}

function isOTPExpired(expiresAt) {
  return Date.now() > expiresAt;
}

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'VibeCheck API',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime()
  });
});

app.post('/api/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid 10-digit phone number'
      });
    }

    if (otpStore.has(phone)) {
      const existing = otpStore.get(phone);
      if (!isOTPExpired(existing.expiresAt)) {
        return res.status(429).json({
          success: false,
          error: 'OTP already sent. Please wait before requesting a new one.'
        });
      }
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + OTP_VALIDITY;

    otpStore.set(phone, {
      otp,
      expiresAt,
      attempts: 0,
      createdAt: new Date().toISOString()
    });

    console.log(`\n[OTP Generated] Phone: ${phone}, OTP: ${otp}\n`);

    setTimeout(() => {
      if (otpStore.has(phone)) {
        const stored = otpStore.get(phone);
        if (isOTPExpired(stored.expiresAt)) {
          otpStore.delete(phone);
        }
      }
    }, OTP_VALIDITY + 1000);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      phone: phone,
      expiresIn: 300
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send OTP'
    });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and OTP are required'
      });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format'
      });
    }

    if (!validateOTP(otp)) {
      return res.status(400).json({
        success: false,
        error: 'OTP must be a 6-digit number'
      });
    }

    if (!otpStore.has(phone)) {
      return res.status(400).json({
        success: false,
        error: 'OTP not found'
      });
    }

    const stored = otpStore.get(phone);

    if (isOTPExpired(stored.expiresAt)) {
      otpStore.delete(phone);
      return res.status(400).json({
        success: false,
        error: 'OTP has expired'
      });
    }

    if (stored.attempts >= MAX_ATTEMPTS) {
      otpStore.delete(phone);
      return res.status(429).json({
        success: false,
        error: 'Maximum attempts exceeded'
      });
    }

    if (stored.otp !== otp) {
      stored.attempts += 1;
      return res.status(400).json({
        success: false,
        error: 'Invalid OTP',
        attemptsRemaining: MAX_ATTEMPTS - stored.attempts
      });
    }

    otpStore.delete(phone);
    const sessionToken = Buffer.from(`${phone}:${Date.now()}`).toString('base64');

    res.json({
      success: true,
      message: 'Phone verified successfully',
      phone: phone,
      token: sessionToken,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify OTP'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'OTP Service',
    activeOTPs: otpStore.size,
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`\nVibeCheck API Server`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Started at: ${new Date().toISOString()}\n`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received');
  process.exit(0);
});
