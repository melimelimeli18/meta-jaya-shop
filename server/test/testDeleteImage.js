// server/test/testDeleteImage.js
// Script untuk testing manual delete image

require("dotenv").config();
const { supabaseAdmin } = require("../config/supabase");

async function testDeleteImage() {
  console.log("====== TEST DELETE IMAGE ======");

  // Test 1: List all files in bucket
  console.log("\n1. Listing all files in 'product-images' bucket:");
  const { data: fileList, error: listError } = await supabaseAdmin.storage
    .from("product-images")
    .list("products", {
      limit: 100,
      offset: 0,
    });

  if (listError) {
    console.error("Error listing files:", listError);
  } else {
    console.log(`Found ${fileList.length} files:`);
    fileList.forEach((file, index) => {
      console.log(
        `  ${index + 1}. ${file.name} (${file.metadata?.size || 0} bytes)`
      );
    });
  }

  // Test 2: Try to delete a specific file
  if (fileList && fileList.length > 0) {
    const testFile = fileList[0];
    const filePath = `products/${testFile.name}`;

    console.log(`\n2. Attempting to delete: ${filePath}`);

    const { data: deleteData, error: deleteError } = await supabaseAdmin.storage
      .from("product-images")
      .remove([filePath]);

    if (deleteError) {
      console.error("❌ Delete failed:");
      console.error("Error:", JSON.stringify(deleteError, null, 2));
    } else {
      console.log("✅ Delete successful!");
      console.log("Response:", deleteData);
    }

    // Test 3: List files again to verify
    console.log("\n3. Listing files again to verify:");
    const { data: fileList2, error: listError2 } = await supabaseAdmin.storage
      .from("product-images")
      .list("products", {
        limit: 100,
        offset: 0,
      });

    if (listError2) {
      console.error("Error listing files:", listError2);
    } else {
      console.log(
        `Found ${fileList2.length} files (should be ${fileList.length - 1})`
      );
    }
  }

  console.log("\n====== TEST COMPLETE ======");
}

// Run test
testDeleteImage().catch(console.error);
