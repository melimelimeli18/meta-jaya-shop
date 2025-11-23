// File: server/controllers/PrivacyPolicy.js

const { supabase } = require("../config/supabase");

// Helper function untuk format tanggal ke Bahasa Indonesia
const formatDateIndonesia = (date) => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
};

// @desc    Get Privacy Policy
// @route   GET /api/privacy-policy
// @access  Public
const getPrivacyPolicy = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("privacy_policy")
      .select("id, content, updated_at")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // Jika tidak ada data, return 404
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Privacy policy not found",
        });
      }
      throw error;
    }

    // Format tanggal ke Bahasa Indonesia
    const formattedDate = formatDateIndonesia(data.updated_at);

    res.status(200).json({
      success: true,
      data: {
        id: data.id,
        content: data.content,
        updated_at: formattedDate,
      },
    });
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Create or Update Privacy Policy
// @route   POST /api/privacy-policy
// @access  Private/Admin
const createOrUpdatePrivacyPolicy = async (req, res) => {
  try {
    // Log untuk debugging
    console.log("Request body:", req.body);

    const content = req.body.content;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const currentDate = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD

    // Check if privacy policy exists
    const { data: existingData, error: checkError } = await supabase
      .from("privacy_policy")
      .select("id")
      .limit(1)
      .single();

    let result;

    if (checkError && checkError.code === "PGRST116") {
      // Privacy policy doesn't exist, create new
      const { data, error } = await supabase
        .from("privacy_policy")
        .insert([
          {
            content: content,
            updated_at: currentDate,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else if (existingData) {
      // Privacy policy exists, update it
      const { data, error } = await supabase
        .from("privacy_policy")
        .update({
          content: content,
          updated_at: currentDate,
        })
        .eq("id", existingData.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      throw checkError;
    }

    const formattedDate = formatDateIndonesia(result.updated_at);

    res.status(200).json({
      success: true,
      message: "Privacy policy saved successfully",
      data: {
        id: result.id,
        content: result.content,
        updated_at: formattedDate,
      },
    });
  } catch (error) {
    console.error("Error saving privacy policy:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Delete Privacy Policy
// @route   DELETE /api/privacy-policy/:id
// @access  Private/Admin
const deletePrivacyPolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("privacy_policy")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Privacy policy not found",
        });
      }
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Privacy policy deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting privacy policy:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getPrivacyPolicy,
  createOrUpdatePrivacyPolicy,
  deletePrivacyPolicy,
};
