// server/controllers/products/getProducts.js
const supabase = require("../../config/supabase");

/**
 * GET all products with optional sorting
 */
const getAllProducts = async (req, res) => {
  try {
    const { sortBy = "name", order = "asc" } = req.query;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order(sortBy, { ascending: order === "asc" });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Error fetching products from Supabase",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * GET product by ID
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * GET products with advanced filters
 */
const getProductsWithFilters = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      minSold,
      search,
      limit = 10,
      offset = 0,
      sortBy = "name",
      order = "asc",
    } = req.query;

    let query = supabase.from("products").select("*", { count: "exact" });

    // Filter by category
    if (category) {
      query = query.eq("category", category);
    }

    // Filter by price range
    if (minPrice) {
      query = query.gte("price", Number(minPrice));
    }
    if (maxPrice) {
      query = query.lte("price", Number(maxPrice));
    }

    // Filter by minimum sold
    if (minSold) {
      query = query.gte("sold", Number(minSold));
    }

    // Search by name or description
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply sorting and pagination
    const { data, error, count } = await query
      .order(sortBy, { ascending: order === "asc" })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Error fetching products",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      count: data.length,
      total: count,
      data: data,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        currentPage: Math.floor(Number(offset) / Number(limit)) + 1,
        totalPages: Math.ceil(count / Number(limit)),
        hasMore: count > Number(offset) + Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * GET products by category
 */
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { sortBy = "name", order = "asc", limit, offset = 0 } = req.query;

    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("category", category);

    // Apply sorting
    query = query.order(sortBy, { ascending: order === "asc" });

    // Apply pagination if limit is provided
    if (limit) {
      query = query.range(Number(offset), Number(offset) + Number(limit) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Error fetching products by category",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      category: category,
      count: data.length,
      total: count,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * GET all unique categories with product count
 */
const getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase.from("products").select("category");

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Error fetching categories",
        error: error.message,
      });
    }

    // Get unique categories with count
    const categoryCount = data.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    const categories = Object.keys(categoryCount).map((cat) => ({
      category: cat,
      productCount: categoryCount[cat],
    }));

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * GET top selling products
 */
const getTopSellingProducts = async (req, res) => {
  try {
    const { limit = 10, category } = req.query;

    let query = supabase
      .from("products")
      .select("*")
      .order("sold", { ascending: false })
      .limit(Number(limit));

    // Filter by category if provided
    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Error fetching top selling products",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * GET product statistics
 */
const getProductStats = async (req, res) => {
  try {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Error fetching product statistics",
        error: error.message,
      });
    }

    if (!data || data.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalProducts: 0,
          totalCategories: 0,
          totalSold: 0,
          averagePrice: 0,
          mostExpensive: null,
          cheapest: null,
          topSeller: null,
        },
      });
    }

    const stats = {
      totalProducts: data.length,
      totalCategories: [...new Set(data.map((p) => p.category))].length,
      totalSold: data.reduce((sum, p) => sum + (p.sold || 0), 0),
      averagePrice:
        data.reduce((sum, p) => sum + Number(p.price), 0) / data.length || 0,
      mostExpensive: data.reduce(
        (max, p) => (Number(p.price) > Number(max.price) ? p : max),
        data[0]
      ),
      cheapest: data.reduce(
        (min, p) => (Number(p.price) < Number(min.price) ? p : min),
        data[0]
      ),
      topSeller: data.reduce(
        (max, p) => ((p.sold || 0) > (max.sold || 0) ? p : max),
        data[0]
      ),
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsWithFilters,
  getProductsByCategory,
  getCategories,
  getTopSellingProducts,
  getProductStats,
};
