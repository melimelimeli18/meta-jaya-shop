// api/admin/logout.js

module.exports.config = {
  api: {
    bodyParser: true,
  },
};

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

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
    // Karena menggunakan JWT, logout hanya perlu menghapus token di client
    // Tidak ada yang perlu dilakukan di server
    return res.status(200).json({
      success: true,
      message: "Logout berhasil",
    });
  } catch (error) {
    console.error("Error logout admin:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
