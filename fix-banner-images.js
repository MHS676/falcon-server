const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function fixBannerImages() {
  try {
    console.log('🔍 Checking banner images...\n');
    
    const banners = await prisma.banner.findMany();
    const uploadsDir = path.join(__dirname, 'uploads', 'banner');
    
    // Get list of actual files in uploads/banner
    const actualFiles = fs.readdirSync(uploadsDir)
      .filter(f => f !== '.gitkeep' && !f.startsWith('.'));
    
    console.log(`📁 Files in uploads/banner:`);
    actualFiles.forEach(f => console.log(`   - ${f}`));
    console.log('');
    
    for (const banner of banners) {
      console.log(`📋 Banner: "${banner.title}"`);
      console.log(`   Current image URL: ${banner.image}`);
      
      // Check if it's a local URL
      if (banner.image.includes('localhost') || banner.image.includes('/uploads/')) {
        // Extract filename from URL
        const filename = banner.image.split('/').pop();
        const filepath = path.join(uploadsDir, filename);
        
        // Check if file exists
        if (!fs.existsSync(filepath)) {
          console.log(`   ❌ File NOT found: ${filename}`);
          console.log(`   💡 Options:`);
          console.log(`      1. Delete this banner`);
          console.log(`      2. Use a placeholder image`);
          console.log(`      3. Upload a new image for this banner`);
        } else {
          console.log(`   ✅ File exists`);
        }
      } else {
        console.log(`   ℹ️  External URL (no check needed)`);
      }
      console.log('');
    }
    
    console.log('\n💡 Recommendation:');
    console.log('   1. Delete banners with missing images using the admin panel');
    console.log('   2. Or update them with new images');
    console.log('   3. Or use the available file: 1763196597155-wqiysj.jpg');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixBannerImages();
