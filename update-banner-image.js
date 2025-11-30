const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateBannerWithExistingImage() {
  try {
    console.log('🔧 Updating banner with missing image...\n');
    
    // Find the banner with the broken image
    const bannerToUpdate = await prisma.banner.findFirst({
      where: {
        image: {
          contains: '1764471394933-vr6vdk.jpg'
        }
      }
    });
    
    if (!bannerToUpdate) {
      console.log('❌ Banner with broken image not found');
      return;
    }
    
    console.log(`📋 Found banner: "${bannerToUpdate.title}"`);
    console.log(`   Old image: ${bannerToUpdate.image}`);
    
    // Update to use the existing image
    const newImageUrl = 'http://localhost:3001/uploads/banner/1763196597155-wqiysj.jpg';
    
    const updated = await prisma.banner.update({
      where: { id: bannerToUpdate.id },
      data: { image: newImageUrl }
    });
    
    console.log(`   New image: ${updated.image}`);
    console.log('\n✅ Banner updated successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Check the frontend - the image should now display');
    console.log('   2. If you want a different image, upload it via the admin panel');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateBannerWithExistingImage();
