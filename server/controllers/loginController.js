// File: server/controllers/loginController.js

const { supabase } = require("../config/supabase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// JWT Secret - simpan di .env
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";
const JWT_EXPIRES_IN = "24h"; // Token berlaku 24 jam

// @desc    Login Admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password harus diisi",
      });
    }

    // Cari admin berdasarkan email
    const { data: admin, error } = await supabase
      .from("admin_login")
      .select("id, email, password")
      .eq("email", email)
      .single();

    if (error || !admin) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

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

    res.status(200).json({
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
    console.error("Error login admin:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Verify Token
// @route   POST /api/admin/verify
// @access  Private
const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Optional: Cek apakah admin masih ada di database
    const { data: admin, error } = await supabase
      .from("admin_login")
      .select("id, email")
      .eq("id", decoded.id)
      .single();

    if (error || !admin) {
      return res.status(401).json({
        success: false,
        message: "Admin tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Token valid",
      data: {
        admin: {
          id: admin.id,
          email: admin.email,
        },
      },
    });
  } catch (error) {
    console.error("Error verify token:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Logout Admin (optional - just remove token from client)
// @route   POST /api/admin/logout
// @access  Private
const logoutAdmin = async (req, res) => {
  try {
    // Karena menggunakan JWT, logout hanya perlu menghapus token di client
    // Tidak ada yang perlu dilakukan di server
    res.status(200).json({
      success: true,
      message: "Logout berhasil",
    });
  } catch (error) {
    console.error("Error logout admin:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Create Admin (untuk setup awal)
// @route   POST /api/admin/create
// @access  Public (sebaiknya di-protect atau dihapus setelah setup)
const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password harus diisi",
      });
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Format email tidak valid",
      });
    }

    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 6 karakter",
      });
    }

    // Cek apakah email sudah ada
    const { data: existing } = await supabase
      .from("admin_login")
      .select("email")
      .eq("email", email)
      .single();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert admin baru
    const { data: newAdmin, error } = await supabase
      .from("admin_login")
      .insert([
        {
          email,
          password: hashedPassword,
        },
      ])
      .select("id, email")
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Admin berhasil dibuat",
      data: {
        admin: {
          id: newAdmin.id,
          email: newAdmin.email,
        },
      },
    });
  } catch (error) {
    console.error("Error create admin:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  loginAdmin,
  verifyToken,
  logoutAdmin,
};
