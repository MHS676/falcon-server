/**
 * Script to fix image URLs in database
 * Converts http://localhost:3001 URLs to production URLs
 * Usage: node fix-image-urls.js
 */

const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Starting image URL migration...\n");

  const productionUrl = "https://falcon-server-production-5ddb.up.railway.app";
  const developmentUrl = "http://localhost:3001";

  // Fix Banner images
  console.log("📸 Fixing Banner images...");
  const banners = await prisma.banner.findMany();
  let bannerCount = 0;
  for (const banner of banners) {
    if (banner.image?.includes(developmentUrl)) {
      const newImage = banner.image.replace(developmentUrl, productionUrl);
      await prisma.banner.update({
        where: { id: banner.id },
        data: { image: newImage },
      });
      console.log(`  ✓ Banner ${banner.id}: ${newImage}`);
      bannerCount++;
    }
  }

  // Fix Gallery images
  console.log("\n🖼️  Fixing Gallery images...");
  const galleries = await prisma.gallery.findMany();
  let galleryCount = 0;
  for (const gallery of galleries) {
    if (gallery.image?.includes(developmentUrl)) {
      const newImage = gallery.image.replace(developmentUrl, productionUrl);
      await prisma.gallery.update({
        where: { id: gallery.id },
        data: { image: newImage },
      });
      console.log(`  ✓ Gallery ${gallery.id}: ${newImage}`);
      galleryCount++;
    }
  }

  console.log(`\n✅ Migration complete!`);
  console.log(`   • Banners updated: ${bannerCount}`);
  console.log(`   • Galleries updated: ${galleryCount}`);
}

main()
  .catch((error) => {
    console.error("❌ Error during migration:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
