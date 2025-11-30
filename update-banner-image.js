/** @format */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function updateBannerWithExistingImage() {
  try {
    console.log("🔧 Updating banner with missing image...\n");

    // Find all banners with localhost URLs
    const banners = await prisma.banner.findMany({
      where: {
        image: {
          contains: "localhost:3001/uploads/banner",
        },
      },
    });

    if (banners.length === 0) {
      console.log("❌ No banners with local image URLs found");
      return;
    }

    // Check which ones have missing files
    const fs = require("fs");
    const path = require("path");
    const uploadsDir = path.join(__dirname, "uploads", "banner");

    for (const banner of banners) {
      const filename = banner.image.split("/").pop();
      const filepath = path.join(uploadsDir, filename);

      if (!fs.existsSync(filepath)) {
        console.log(`📋 Found banner with missing image: "${banner.title}"`);
        console.log(`   Old image: ${banner.image}`);

        // Update to use the existing image
        const newImageUrl =
          "http://localhost:3001/uploads/banner/1763196597155-wqiysj.jpg";

        const updated = await prisma.banner.update({
          where: { id: banner.id },
          data: { image: newImageUrl },
        });

        console.log(`   New image: ${updated.image}`);
        console.log("✅ Banner updated successfully!\n");
      }
    }

    console.log("💡 Next steps:");
    console.log(
      "   1. Restart the backend server for upload fix to take effect"
    );
    console.log("   2. Check the frontend - images should now display");
    console.log("   3. Try uploading a new banner image to test the fix");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateBannerWithExistingImage();
