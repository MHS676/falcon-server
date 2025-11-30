/** @format */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkBanners() {
  try {
    const banners = await prisma.banner.findMany();
    console.log(`\n📊 Total banners in database: ${banners.length}\n`);

    if (banners.length === 0) {
      console.log("❌ No banners found!");
    } else {
      banners.forEach((banner, index) => {
        console.log(`${index + 1}. ${banner.title}`);
        console.log(`   Image URL: ${banner.image}`);
        console.log(`   Active: ${banner.active}`);
        console.log(`   Order: ${banner.order}`);
        console.log("");
      });
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBanners();
