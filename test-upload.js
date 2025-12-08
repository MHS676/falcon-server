/** @format */

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

async function testImageUpload() {
  try {
    // Use an existing test image
    const testImagePath = path.join(
      __dirname,
      "uploads",
      "banner",
      "1763196597155-wqiysj.jpg"
    );

    if (!fs.existsSync(testImagePath)) {
      console.log("❌ Test image not found at:", testImagePath);
      console.log("Looking for other test images...");
      const bannerDir = path.join(__dirname, "uploads", "banner");
      const files = fs.readdirSync(bannerDir).filter((f) => f.endsWith(".jpg"));
      if (files.length > 0) {
        console.log("Found:", files);
        return;
      }
      return;
    }

    const formData = new FormData();
    formData.append("file", fs.createReadStream(testImagePath));

    console.log(
      "📤 Testing image upload to /api/upload/image?folder=banner..."
    );
    console.log("Using file:", testImagePath);

    const response = await axios.post(
      "http://localhost:3001/api/upload/image?folder=banner",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    console.log("✅ Upload successful!");
    console.log("Response:", JSON.stringify(response.data, null, 2));

    // Verify the uploaded file exists
    if (response.data.url) {
      const filename = response.data.url.split("/").pop();
      const uploadedPath = path.join(__dirname, "uploads", "banner", filename);
      if (fs.existsSync(uploadedPath)) {
        const stats = fs.statSync(uploadedPath);
        console.log(
          `✅ File verified on disk: ${filename} (${stats.size} bytes)`
        );
      }
    }
  } catch (error) {
    console.error("❌ Upload failed!");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response:", error.response.data);
    } else if (error.code === "ECONNREFUSED") {
      console.error(
        "Error: Backend server is not running on http://localhost:3001"
      );
      console.error(
        "Please start the backend with: cd backend && npm run start:dev"
      );
    } else {
      console.error("Error:", error.message);
    }
  }
}

// Test banner creation with image
async function testBannerCreation() {
  try {
    const testImagePath = path.join(
      __dirname,
      "uploads",
      "banner",
      "1763196597155-wqiysj.jpg"
    );

    if (!fs.existsSync(testImagePath)) {
      console.log("Skipping banner creation test - no test image found");
      return;
    }

    const formData = new FormData();
    formData.append("title", "Test Banner " + Date.now());
    formData.append("subtitle", "Test subtitle");
    formData.append("active", "true");
    formData.append("order", "99");
    formData.append("image", fs.createReadStream(testImagePath));

    console.log("\n📤 Testing banner creation with image upload...");

    const response = await axios.post(
      "http://localhost:3001/api/banner",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    console.log("✅ Banner created successfully!");
    console.log("Response:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ Banner creation failed!");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response:", error.response.data);
    } else if (error.code === "ECONNREFUSED") {
      console.error("Error: Backend server is not running");
    } else {
      console.error("Error:", error.message);
    }
  }
}

console.log("🧪 Starting upload tests...\n");
testImageUpload()
  .then(() => testBannerCreation())
  .then(() => console.log("\n✅ All tests completed"))
  .catch((err) => console.error("\n❌ Test suite failed:", err));
