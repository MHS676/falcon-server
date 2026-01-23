/** @format */

// Test Cloudinary connection
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dpzrd9sry",
  api_key: "414148751762226",
  api_secret: "J4DmX6V28lIXaUBGBnYqYOVXc2I",
});

async function testCloudinary() {
  console.log("🔄 Testing Cloudinary connection...\n");

  try {
    // Test 1: Check account info
    console.log("1. Checking account...");
    const result = await cloudinary.api.ping();
    console.log("   ✅ Cloudinary connection successful!");
    console.log(`   Status: ${result.status}\n`);

    // Test 2: Upload a test image (using a sample URL)
    console.log("2. Testing upload with sample image...");
    const uploadResult = await cloudinary.uploader.upload(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/320px-Camponotus_flavomarginatus_ant.jpg",
      {
        folder: "falcon-security/test",
        public_id: "test-upload-" + Date.now(),
      },
    );
    console.log("   ✅ Upload successful!");
    console.log(`   URL: ${uploadResult.secure_url}`);
    console.log(`   Public ID: ${uploadResult.public_id}\n`);

    // Test 3: Delete the test image
    console.log("3. Cleaning up test image...");
    const deleteResult = await cloudinary.uploader.destroy(
      uploadResult.public_id,
    );
    console.log(`   ✅ Delete result: ${deleteResult.result}\n`);

    console.log("🎉 All Cloudinary tests passed!\n");
    console.log("Your Cloudinary configuration is working correctly.");
    console.log(
      "Images will be uploaded to: https://res.cloudinary.com/dctg5gg8i/",
    );
  } catch (error) {
    console.error("❌ Cloudinary test failed:", error.message);
    if (error.error) {
      console.error("   Error details:", error.error);
    }
    process.exit(1);
  }
}

testCloudinary();
