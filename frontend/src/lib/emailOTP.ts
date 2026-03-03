import { supabase } from "./supabase";
import { generateDummyEmailOTP, verifyDummyOTP } from "./dummyOTP";

const USE_DUMMY_OTP = true; // Toggle this to switch between dummy and real OTP

/**
 * Send Email OTP
 * Currently using DUMMY OTP (for testing without email service)
 * Later: Set USE_DUMMY_OTP = false to integrate real Supabase email
 *
 * @param email - User's email address
 * @returns { success: boolean, message?: string, error?: string, code?: string }
 */
export async function sendEmailOTP(email: string) {
  try {
    console.log("📧 Sending Email OTP to:", email);

    if (USE_DUMMY_OTP) {
      // DUMMY OTP: Generate test code
      const code = generateDummyEmailOTP(email);

      return {
        success: true,
        message: `✅ TEST OTP CODE: ${code}`,
        code,
        note: "DUMMY OTP (For dev/testing only) - Check console for code",
      };
    } else {
      // REAL OTP: Use Supabase email authentication
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("❌ Email OTP Error:", error.message);
        return {
          success: false,
          error: error.message,
        };
      }

      console.log("✅ Real email OTP sent successfully");
      return {
        success: true,
        message: "Email sent! Check your inbox for the magic link.",
        data,
      };
    }
  } catch (err: any) {
    console.error("💥 Exception in sendEmailOTP:", err);
    return {
      success: false,
      error: err.message || "Failed to send email OTP",
    };
  }
}

/**
 * Verify Email OTP Code
 * Works with both dummy and real OTP
 *
 * @param email - User's email
 * @param token - OTP code (6 digits)
 * @returns { success: boolean, user?: any, error?: string }
 */
export async function verifyEmailOTP(email: string, token: string) {
  try {
    console.log("🔐 Verifying email OTP code...");

    if (USE_DUMMY_OTP) {
      // DUMMY OTP: Verify against stored code
      const result = verifyDummyOTP(email, token, "email");

      if (!result.valid) {
        return {
          success: false,
          error: result.message,
        };
      }

      // Return mock user object for dummy OTP
      return {
        success: true,
        message: "Email verified!",
        user: {
          id: `dummy-user-${Date.now()}`,
          email: email,
          aud: "authenticated",
        },
      };
    } else {
      // REAL OTP: Use Supabase verification
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: token,
        type: "email",
      });

      if (error) {
        console.error("❌ OTP Verification Error:", error.message);
        return {
          success: false,
          error: error.message,
        };
      }

      console.log("✅ Email OTP verified successfully");
      return {
        success: true,
        message: "Email verified!",
        user: data.user,
        session: data.session,
      };
    }
  } catch (err: any) {
    console.error("💥 Exception in verifyEmailOTP:", err);
    return {
      success: false,
      error: err.message || "Failed to verify OTP",
    };
  }
}
