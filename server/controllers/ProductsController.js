const supabase = require("../config/supabase");

// GET all products
const getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true });

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

// GET product by ID
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

// GET products with filters (category, price range, search)
const getProductsWithFilters = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
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

// GET products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .order("name", { ascending: true });

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

// GET all unique categories
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

    // Get unique categories
    const categories = [...new Set(data.map((item) => item.category))];

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

module.exports = {
  getAllProducts,
  getProductById,
  getProductsWithFilters,
  getProductsByCategory,
  getCategories,
};
