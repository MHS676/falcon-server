const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBlogs() {
  try {
    const blogs = await prisma.blog.findMany();
    console.log(`\n📊 Total blogs in database: ${blogs.length}\n`);
    
    if (blogs.length === 0) {
      console.log('❌ No blogs found! Running seed might have failed.');
    } else {
      blogs.forEach((blog, index) => {
        console.log(`${index + 1}. ${blog.title}`);
        console.log(`   Published: ${blog.published}`);
        console.log(`   Slug: ${blog.slug}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBlogs();
