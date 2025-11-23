// src/app/api/products/featured/batch/route.ts
import { NextRequest, NextResponse } from "next/server";

const EXPRESS_API_URL = process.env.NEXT_PUBLIC_EXPRESS_API_URL;

/**
 * PATCH /api/products/featured/batch → Batch update featured status
 */
export async function PATCH(request: NextRequest) {
  console.log("========== BATCH FEATURED UPDATE REQUEST ==========");
  console.log("Environment Variable - EXPRESS_API_URL:", EXPRESS_API_URL);

  try {
    const body = await request.json();
    console.log("Request body:", body);

    const fullUrl = `${EXPRESS_API_URL}/products/featured/batch`;
    console.log("Full URL being called:", fullUrl);
    console.log("Request method:", "PATCH");

    const response = await fetch(fullUrl, {
      method: "PATCH",
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
    console.error("========== ERROR IN BATCH FEATURED UPDATE ==========");
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "Unknown error"
    );
    console.error("Full error:", error);
    console.error("========== END ERROR ==========\n");

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update featured products",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
