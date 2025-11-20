const express = require('express');
const cors = require('cors');

const app = express();

// Environment variables
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory OTP storage (in production, use Redis or database)
const otpStore = new Map();

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'VibeCheck API',
    timestamp: new Date().toISOString()
  });
});

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ 
        error: 'Please provide a valid 10-digit phone number' 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    otpStore.set(phone, { otp, expiresAt });

    // Log OTP for testing (in production, send via SMS)
    console.log(`OTP for ${phone}: ${otp}`);

    // Clean up expired OTPs
    setTimeout(() => {
      const stored = otpStore.get(phone);
      if (stored && stored.expiresAt <= Date.now()) {
        otpStore.delete(phone);
      }
    }, 5 * 60 * 1000);

    res.json({ 
      success: true, 
      message: 'OTP sent successfully. Check server logs for OTP (testing mode)',
      phone: phone 
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ 
      error: 'Failed to send OTP. Please try again.' 
    });
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ 
        error: 'Phone number and OTP are required' 
      });
    }

    // Get stored OTP
    const stored = otpStore.get(phone);

    if (!stored) {
      return res.status(400).json({ 
        error: 'OTP expired or not found. Please request a new OTP.' 
      });
    }

    // Check expiration
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(phone);
      return res.status(400).json({ 
        error: 'OTP has expired. Please request a new OTP.' 
      });
    }

    // Verify OTP
    if (stored.otp !== otp) {
      return res.status(400).json({ 
        error: 'Invalid OTP. Please try again.' 
      });
    }

    // OTP verified - clean up
    otpStore.delete(phone);

    // Generate session token (simplified for demo)
    const sessionToken = Buffer.from(`${phone}:${Date.now()}`).toString('base64');

    res.json({ 
      success: true, 
      message: 'Phone number verified successfully',
      token: sessionToken,
      phone: phone
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ 
      error: 'Failed to verify OTP. Please try again.' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`VibeCheck API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
