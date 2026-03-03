/**
 * Dummy OTP System
 * Generates test OTP codes locally without sending real emails/SMS
 * Used for development/testing before real email service is set up
 */

interface StoredOTP {
  code: string;
  email?: string;
  phone?: string;
  createdAt: number;
  expiresAt: number;
}

// Store OTPs in memory (expires after 10 minutes)
const otpStore = new Map<string, StoredOTP>();
const OTP_VALIDITY_MINUTES = 10;

/**
 * Generate a random 6-digit OTP code
 */
function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate and store dummy OTP for email
 * @param email - User's email address
 * @returns OTP code for testing
 */
export function generateDummyEmailOTP(email: string): string {
  const code = generateOTPCode();
  const now = Date.now();
  const expiresAt = now + OTP_VALIDITY_MINUTES * 60 * 1000;

  otpStore.set(`email:${email}`, {
    code,
    email,
    createdAt: now,
    expiresAt,
  });

  console.log(
    "%c🔵 DUMMY EMAIL OTP GENERATED",
    "color: blue; font-weight: bold",
  );
  console.log(`📧 Email: ${email}`);
  console.log(
    `%c🔐 TEST OTP CODE: ${code}`,
    "color: red; font-weight: bold; font-size: 14px",
  );
  console.log(`⏰ Valid for ${OTP_VALIDITY_MINUTES} minutes`);

  return code;
}

/**
 * Generate and store dummy OTP for phone
 * @param phone - User's phone number
 * @returns OTP code for testing
 */
export function generateDummyPhoneOTP(phone: string): string {
  const code = generateOTPCode();
  const now = Date.now();
  const expiresAt = now + OTP_VALIDITY_MINUTES * 60 * 1000;

  const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

  otpStore.set(`phone:${formattedPhone}`, {
    code,
    phone: formattedPhone,
    createdAt: now,
    expiresAt,
  });

  console.log(
    "%c🔵 DUMMY PHONE OTP GENERATED",
    "color: blue; font-weight: bold",
  );
  console.log(`📱 Phone: ${formattedPhone}`);
  console.log(
    `%c🔐 TEST OTP CODE: ${code}`,
    "color: red; font-weight: bold; font-size: 14px",
  );
  console.log(`⏰ Valid for ${OTP_VALIDITY_MINUTES} minutes`);

  return code;
}

/**
 * Verify dummy OTP code
 * @param identifier - Email or phone number
 * @param code - OTP code to verify
 * @param type - 'email' or 'phone'
 * @returns { valid: boolean, message: string }
 */
export function verifyDummyOTP(
  identifier: string,
  code: string,
  type: "email" | "phone",
): { valid: boolean; message: string } {
  const key = `${type}:${identifier}`;
  const stored = otpStore.get(key);

  if (!stored) {
    return {
      valid: false,
      message: `No OTP found for this ${type}. Request a new one.`,
    };
  }

  const now = Date.now();
  if (now > stored.expiresAt) {
    otpStore.delete(key);
    return {
      valid: false,
      message: "OTP expired. Request a new one.",
    };
  }

  if (stored.code !== code) {
    return {
      valid: false,
      message: "Invalid OTP code. Try again.",
    };
  }

  // OTP is valid, remove it (one-time use)
  otpStore.delete(key);
  console.log(
    "%c✅ OTP VERIFIED SUCCESSFULLY",
    "color: green; font-weight: bold",
  );

  return {
    valid: true,
    message: "OTP verified!",
  };
}

/**
 * Clear all stored OTPs (for testing/debugging)
 */
export function clearAllOTPs(): void {
  otpStore.clear();
  console.log("🗑️  All OTPs cleared");
}

/**
 * Get all stored OTPs (for debugging)
 */
export function getStoredOTPs(): Record<string, any> {
  const result: Record<string, any> = {};
  otpStore.forEach((otp, key) => {
    const expiresIn = Math.round((otp.expiresAt - Date.now()) / 1000);
    result[key] = {
      code: otp.code,
      expiresIn: `${expiresIn}s`,
    };
  });
  return result;
}
