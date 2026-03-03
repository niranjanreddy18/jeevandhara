import { supabase } from "./supabase";
import { generateDummyPhoneOTP, verifyDummyOTP } from "./dummyOTP";

const USE_DUMMY_OTP = true; // Toggle this to switch between dummy and real OTP

/**
 * Send Phone OTP (SMS)
 * Currently using DUMMY OTP (for testing without SMS service)
 * Later: Set USE_DUMMY_OTP = false to integrate real Supabase phone authentication
 *
 * @param phone - Phone number (e.g., +1234567890)
 * @returns { success: boolean, message?: string, error?: string, code?: string }
 */
export async function sendPhoneOTP(phone: string) {
  try {
    const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
    console.log("📱 Sending Phone OTP to:", formattedPhone);

    if (USE_DUMMY_OTP) {
      // DUMMY OTP: Generate test code
      const code = generateDummyPhoneOTP(formattedPhone);

      return {
        success: true,
        message: `✅ TEST OTP CODE: ${code}`,
        code,
        note: "DUMMY OTP (For dev/testing only) - Check console for code",
      };
    } else {
      // REAL OTP: Use Supabase SMS authentication (requires Twilio)
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        console.error("❌ Phone OTP Error:", error.message);
        return {
          success: false,
          error: error.message,
        };
      }

      console.log("✅ SMS OTP sent successfully");
      return {
        success: true,
        message: "SMS sent! Check your phone for the OTP code.",
        data,
      };
    }
  } catch (err: any) {
    console.error("💥 Exception in sendPhoneOTP:", err);
    return {
      success: false,
      error: err.message || "Failed to send SMS OTP",
    };
  }
}

/**
 * Verify Phone OTP Code
 * Works with both dummy and real OTP
 *
 * @param phone - Phone number used for signup
 * @param token - OTP code (6 digits) from SMS
 * @returns { success: boolean, user?: any, error?: string }
 */
export async function verifyPhoneOTP(phone: string, token: string) {
  try {
    const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
    console.log("🔐 Verifying phone OTP code...");

    if (USE_DUMMY_OTP) {
      // DUMMY OTP: Verify against stored code
      const result = verifyDummyOTP(formattedPhone, token, "phone");

      if (!result.valid) {
        return {
          success: false,
          error: result.message,
        };
      }

      // Return mock user object for dummy OTP
      return {
        success: true,
        message: "Phone verified!",
        user: {
          id: `dummy-user-${Date.now()}`,
          phone: formattedPhone,
          aud: "authenticated",
        },
      };
    } else {
      // REAL OTP: Use Supabase SMS verification
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: token,
        type: "sms",
      });

      if (error) {
        console.error("❌ OTP Verification Error:", error.message);
        return {
          success: false,
          error: error.message,
        };
      }

      console.log("✅ Phone OTP verified successfully");
      return {
        success: true,
        message: "Phone verified!",
        user: data.user,
        session: data.session,
      };
    }
  } catch (err: any) {
    console.error("💥 Exception in verifyPhoneOTP:", err);
    return {
      success: false,
      error: err.message || "Failed to verify OTP",
    };
  }
}
