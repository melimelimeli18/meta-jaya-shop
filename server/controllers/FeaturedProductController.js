// server/controllers/FeaturedProductController.js
const { supabase } = require("../config/supabase"); // Sesuaikan dengan konfigurasi Supabase Anda

const FeaturedProductController = {
  // Batch update featured status
  batchUpdateFeatured: async (req, res) => {
    try {
      const { products } = req.body;

      console.log("========== BATCH UPDATE FEATURED ==========");
      console.log("Products to update:", products);

      if (!products || !Array.isArray(products)) {
        return res.status(400).json({
          success: false,
          message: "Invalid request body. Expected products array.",
        });
      }

      // Count how many should be featured
      const featuredCount = products.filter((p) => p.shouldBeFeatured).length;

      if (featuredCount > 3) {
        return res.status(400).json({
          success: false,
          message: "Maksimal hanya 3 produk yang bisa dijadikan unggulan!",
        });
      }

      // Update all products in a transaction-like manner
      const updatePromises = products.map(async (product) => {
        const { data, error } = await supabase
          .from("products")
          .update({ is_featured: product.shouldBeFeatured })
          .eq("id", product.id)
          .select()
          .single();

        if (error) {
          console.error(`Error updating product ${product.id}:`, error);
          throw error;
        }

        return data;
      });

      const results = await Promise.all(updatePromises);

      console.log("Update results:", results);
      console.log("========== END BATCH UPDATE ==========\n");

      res.status(200).json({
        success: true,
        message: `Berhasil mengupdate ${products.length} produk`,
        data: {
          updated: results.length,
          featuredCount: featuredCount,
        },
      });
    } catch (error) {
      console.error("Error in batch update featured:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengupdate produk unggulan",
        error: error.message,
      });
    }
  },

  // Toggle featured status (keep this for backward compatibility)
  toggleFeaturedStatus: async (req, res) => {
    try {
      const { id } = req.params;

      // First, get the current product
      const { data: currentProduct, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const newFeaturedStatus = !currentProduct.is_featured;

      // If trying to set as featured, check if limit reached
      if (newFeaturedStatus) {
        const { data: featuredProducts, error: countError } = await supabase
          .from("products")
          .select("id")
          .eq("is_featured", true);

        if (countError) throw countError;

        if (featuredProducts.length >= 3) {
          return res.status(400).json({
            success: false,
            message: "Maksimal hanya 3 produk yang bisa dijadikan unggulan!",
          });
        }
      }

      // Update the featured status
      const { data, error } = await supabase
        .from("products")
        .update({ is_featured: newFeaturedStatus })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: `Produk berhasil ${
          newFeaturedStatus ? "ditambahkan ke" : "dihapus dari"
        } unggulan`,
        data: {
          id: data.id,
          name: data.name,
          isFeatured: data.is_featured,
        },
      });
    } catch (error) {
      console.error("Error toggling featured status:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengubah status unggulan",
        error: error.message,
      });
    }
  },
};

module.exports = FeaturedProductController;
