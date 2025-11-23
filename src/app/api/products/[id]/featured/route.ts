// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";

const EXPRESS_API_URL = process.env.NEXT_PUBLIC_EXPRESS_API_URL;

/**
 * GET /api/products → Fetch ALL products
 */
export async function GET(request: NextRequest) {
  console.log("========== GET ALL PRODUCTS REQUEST ==========");
  console.log("Environment Variable - EXPRESS_API_URL:", EXPRESS_API_URL);

  try {
    const fullUrl = `${EXPRESS_API_URL}/products`;
    console.log("Full URL being called:", fullUrl);
    console.log("Request method:", "GET");

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    const data = await response.json();
    console.log(
      "Response data length:",
      Array.isArray(data) ? data.length : "Not an array"
    );
    console.log(
      "Response data structure:",
      data.success !== undefined
        ? "Has success property"
        : "Direct array or object"
    );
    console.log("========== END REQUEST ==========\n");

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("========== ERROR IN GET PRODUCTS ==========");
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "Unknown error"
    );
    console.error("Full error:", error);
    console.error("========== END ERROR ==========\n");

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products → Create new product
 */
export async function POST(request: NextRequest) {
  console.log("========== CREATE PRODUCT REQUEST ==========");
  console.log("Environment Variable - EXPRESS_API_URL:", EXPRESS_API_URL);

  try {
    const body = await request.json();
    console.log("Request body:", body);

    const fullUrl = `${EXPRESS_API_URL}/products`;
    console.log("Full URL being called:", fullUrl);
    console.log("Request method:", "POST");

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    const data = await response.json();
    console.log("Response data:", data);
    console.log("========== END REQUEST ==========\n");

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("========== ERROR IN CREATE PRODUCT ==========");
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "Unknown error"
    );
    console.error("Full error:", error);
    console.error("========== END ERROR ==========\n");

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
