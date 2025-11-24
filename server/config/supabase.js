// server/config/supabase.js

// require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables!");
}

console.log("🔧 Supabase Config:");
console.log("  URL:", supabaseUrl);
console.log("  Anon Key:", supabaseAnonKey ? "✅ Set" : "❌ Missing");
console.log("  Service Key:", supabaseServiceKey ? "✅ Set" : "❌ Missing");

// Client normal (dengan RLS)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client admin (bypass RLS) - gunakan untuk Storage operations
let supabaseAdmin = null;

if (supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  console.log("✅ Supabase Admin client initialized");
} else {
  console.warn(
    "⚠️  SUPABASE_SERVICE_ROLE_KEY not found, using anon key for storage operations"
  );
  supabaseAdmin = supabase; // Fallback ke client biasa
}

// Export default untuk backward compatibility
module.exports = supabase;

// Export named exports untuk yang baru
module.exports.supabase = supabase;
module.exports.supabaseAdmin = supabaseAdmin;
