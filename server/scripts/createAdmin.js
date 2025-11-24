// File: server/scripts/createAdmin.js
// Script untuk membuat admin pertama kali

const { supabase } = require("../config/supabase");
const bcrypt = require("bcrypt");
// dotenv.config();

async function createFirstAdmin() {
  try {
    // Ganti dengan email dan password yang Anda inginkan
    const email = process.env.EMAIL_ADMIN;
    const password = process.env.PASSWORD_ADMIN;

    console.log("🔐 Creating first admin...");
    console.log("Email:", email);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert admin
    const { data, error } = await supabase
      .from("admin_login")
      .insert([
        {
          email,
          password: hashedPassword,
        },
      ])
      .select("id, email")
      .single();

    if (error) {
      if (error.code === "23505") {
        console.log("⚠️  Admin dengan email ini sudah ada!");
        process.exit(0);
      }
      throw error;
    }

    console.log("✅ Admin berhasil dibuat!");
    console.log("ID:", data.id);
    console.log("Email:", data.email);
    console.log("\n⚠️  PENTING: Ganti password setelah login pertama kali!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
}

createFirstAdmin();
