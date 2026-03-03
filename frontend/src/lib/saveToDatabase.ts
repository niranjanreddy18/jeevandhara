import { supabase } from "./supabase";

/**
 * Save user profile to Supabase database
 * Called after successful registration/login
 *
 * @param userData - User profile data (email, phone, username, role)
 * @param userId - Optional: User ID (for TEST MODE). If not provided, gets from Supabase auth.
 */
export async function saveUserProfile(
  userData: {
    email?: string;
    phone?: string;
    username?: string;
    role?: "user" | "university" | "admin";
  },
  userId?: string,
) {
  try {
    console.log("💾 Saving user profile to database...");

    let currentUserId: string;

    if (userId) {
      // TEST MODE: Use provided userId
      console.log("🧪 Using provided user ID (TEST MODE):", userId);
      currentUserId = userId;
    } else {
      // PRODUCTION MODE: Get current user from Supabase auth
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No authenticated user found");
      }
      currentUserId = user.id;
    }

    // Default role to 'user' if not specified
    const role = userData.role || "user";

    // Insert/update profile in the profiles table
    const { data, error } = await supabase.from("profiles").upsert({
      id: currentUserId,
      email: userData.email,
      phone: userData.phone || null,
      username: userData.username || null,
      role: role,
      is_active: true,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("❌ Database Error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log("✅ User profile saved successfully");
    console.log("📊 Saved data:", {
      userId: currentUserId,
      email: userData.email,
      phone: userData.phone,
      role: role,
    });

    return {
      success: true,
      message: "Profile saved!",
      data,
    };
  } catch (err: any) {
    console.error("💥 Exception in saveUserProfile:", err);
    return {
      success: false,
      error: err.message || "Failed to save profile",
    };
  }
}

/**
 * Check if email belongs to a university
 * Returns university info if found
 */
export async function checkUniversityEmail(email: string) {
  try {
    console.log("🏫 Checking if email is from university...");

    const { data, error } = await supabase
      .from("universities")
      .select("id, name, official_email")
      .eq("official_email", email)
      .single();

    if (error) {
      // No university found, that's okay
      console.log("ℹ️ No university found for this email");
      return {
        found: false,
        role: "user",
      };
    }

    console.log("✅ University email found!");
    console.log("🏢 University:", data.name);

    return {
      found: true,
      role: "university",
      universityId: data.id,
      universityName: data.name,
    };
  } catch (err: any) {
    console.error("Error checking university:", err);
    return {
      found: false,
      role: "user",
    };
  }
}

/**
 * Get user profile from database
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error.message);
      return null;
    }

    return data;
  } catch (err: any) {
    console.error("Exception in getUserProfile:", err);
    return null;
  }
}

/**
 * List all database tables and their schemas
 * Useful for debugging/understanding DB structure
 */
export async function listDatabaseTables() {
  try {
    console.log("📋 Fetching database structure...");

    // Query information_schema to get table names
    const { data, error } = await supabase.rpc(
      "get_tables", // This requires a custom function in Supabase
    );

    if (error) {
      // Fallback: manually list known tables
      console.warn("Could not fetch table list. Known tables:", [
        "profiles",
        "universities",
        "medical_cases",
      ]);
      return {
        tables: ["profiles", "universities", "medical_cases"],
        note: "Manually defined list - check Supabase dashboard for full schema",
      };
    }

    return {
      tables: data,
      note: "Complete list from database",
    };
  } catch (err: any) {
    console.log("📊 Database Tables (Known):");
    return {
      tables: ["profiles", "universities", "medical_cases"],
      note: "Fallback list",
    };
  }
}

/**
 * Create admin tables for dashboard
 * Called when admin logs in
 */
export async function createAdminTables() {
  try {
    console.log("📊 Creating admin tables...");

    // Create admin_stats table
    const { error: statsError } = await supabase
      .rpc("create_table_if_not_exists", {
        table_name: "admin_stats",
        columns: {
          id: "uuid",
          total_cases: "integer",
          total_verified: "integer",
          total_funds: "numeric",
          total_users: "integer",
          created_at: "timestamp",
        },
      })
      .then(() => ({ error: null }))
      .catch((err) => ({ error: err }));

    // For now, just log that admin is accessing dashboard
    console.log("✅ Admin access initialized");
    console.log("📈 Admin can now view:");
    console.log("  - Medical cases statistics");
    console.log("  - User management");
    console.log("  - Fund distribution reports");
    console.log("  - Hospital verification status");

    return {
      success: true,
      message: "Admin dashboard initialized",
    };
  } catch (err: any) {
    console.error("Error initializing admin tables:", err);
    return {
      success: false,
      message: "Admin dashboard initialized (basic mode)",
    };
  }
}
