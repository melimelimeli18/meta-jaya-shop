// api/admin/login.js
const { supabase } = require("../../server/config/supabase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "24h";

module.exports.config = {
  api: {
    bodyParser: true,
  },
};

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    console.log("=== LOGIN DEBUG ===");
    console.log("Body type:", typeof req.body);
    console.log("Body:", req.body);

    let body = req.body;

    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error("JSON parse error:", e);
      }
    }

    if (!body || typeof body !== "object") {
      return res.status(400).json({
        success: false,
        message: "Request body is empty or invalid",
      });
    }

    const { email, password } = body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password harus diisi",
      });
    }

    console.log("Searching for admin with email:", email);

    // Cari admin berdasarkan email
    const { data: admin, error } = await supabase
      .from("admin_login")
      .select("id, email, password")
      .eq("email", email)
      .single();

    if (error) {
      console.error("Supabase error:", error);
    }

    if (error || !admin) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    console.log("Admin found, verifying password...");

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      console.log("Password invalid");
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    console.log("Password valid, generating token...");

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    console.log("Login successful");

    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
        },
      },
    });
  } catch (error) {
    console.error("=== LOGIN ERROR ===");
    console.error("Error details:", error);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
