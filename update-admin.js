const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function updateAdminPassword() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const updated = await prisma.admin.updateMany({
      where: { email: 'admin@secureguard.com' },
      data: { password: hashedPassword }
    });
    
    console.log('Admin password updated successfully:', updated);
  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();