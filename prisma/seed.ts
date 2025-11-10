import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user with proper bcrypt hash
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@secureguard.com' },
    update: {
      password: hashedPassword // Update password even if user exists
    },
    create: {
      name: 'Admin',
      email: 'admin@secureguard.com',
      password: hashedPassword,
    },
  });

  console.log('Admin created:', admin);

  // Create services
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: 'security-monitoring-service' },
      update: {},
      create: {
        id: 'security-monitoring-service',
        title: '24/7 Security Monitoring',
        description: 'Round-the-clock surveillance and monitoring services for your property.',
        icon: 'EyeIcon',
        features: ['Live monitoring', 'Immediate response', 'Advanced cameras', 'Alert system'],
        price: 'Starting at $299/month',
        active: true,
        featured: true,
        order: 1,
      },
    }),
    prisma.service.upsert({
      where: { id: 'access-control-service' },
      update: {},
      create: {
        id: 'access-control-service',
        title: 'Access Control Systems',
        description: 'Advanced access control solutions to secure your premises.',
        icon: 'LockClosedIcon',
        features: ['Keycard access', 'Biometric scanning', 'Visitor management', 'Audit trails'],
        price: 'Starting at $199/month',
        active: true,
        featured: true,
        order: 2,
      },
    }),
    prisma.service.upsert({
      where: { id: 'mobile-patrol-service' },
      update: {},
      create: {
        id: 'mobile-patrol-service',
        title: 'Mobile Patrol Services',
        description: 'Professional mobile patrol services for multiple locations.',
        icon: 'TruckIcon',
        features: ['Scheduled patrols', 'Random checks', 'Incident response', 'Detailed reports'],
        price: 'Starting at $149/month',
        active: true,
        order: 3,
      },
    }),
    prisma.service.upsert({
      where: { id: 'event-security-service' },
      update: {},
      create: {
        id: 'event-security-service',
        title: 'Event Security',
        description: 'Comprehensive security solutions for events and gatherings.',
        icon: 'UsersIcon',
        features: ['Crowd control', 'VIP protection', 'Bag screening', 'Emergency planning'],
        price: 'Custom pricing',
        active: true,
        order: 4,
      },
    }),
  ]);

  console.log('Services created:', services.length);

  // Create clients
  const clients = await Promise.all([
    prisma.client.upsert({
      where: { id: 'metro-corporate-center' },
      update: {},
      create: {
        id: 'metro-corporate-center',
        name: 'Metro Corporate Center',
        company: 'Metro Corp',
        position: 'Security Manager',
        testimonial: 'SecureGuard has provided excellent security services for our corporate center. Their professional team and 24/7 monitoring give us complete peace of mind.',
        image: '/images/clients/metro-corp.png',
        rating: 5,
        projectType: 'Corporate Security',
        featured: true,
        active: true,
      },
    }),
    prisma.client.upsert({
      where: { id: 'sunrise-shopping-mall' },
      update: {},
      create: {
        id: 'sunrise-shopping-mall',
        name: 'Maria Garcia',
        company: 'Sunrise Shopping Mall',
        position: 'Operations Manager',
        testimonial: 'Outstanding security services! SecureGuard\'s team is professional, reliable, and always ready to handle any situation.',
        image: '/images/clients/sunrise-mall.png',
        rating: 5,
        projectType: 'Retail Security',
        featured: true,
        active: true,
      },
    }),
    prisma.client.upsert({
      where: { id: 'techhub-innovation' },
      update: {},
      create: {
        id: 'techhub-innovation',
        name: 'Alex Thompson',
        company: 'TechHub Innovation Center',
        position: 'Facilities Manager',
        testimonial: 'We trust SecureGuard with our facility security. Their advanced systems and professional staff exceed our expectations.',
        image: '/images/clients/techhub.png',
        rating: 5,
        projectType: 'Technology Security',
        featured: true,
        active: true,
      },
    }),
    prisma.client.upsert({
      where: { id: 'riverside-medical' },
      update: {},
      create: {
        id: 'riverside-medical',
        name: 'Dr. Jennifer Liu',
        company: 'Riverside Medical Complex',
        position: 'Security Director',
        testimonial: 'SecureGuard understands the unique security needs of healthcare facilities. Their service is exceptional.',
        image: '/images/clients/riverside-medical.png',
        rating: 5,
        projectType: 'Healthcare Security',
        featured: true,
        active: true,
      },
    }),
  ]);

  console.log('Clients created:', clients.length);

  // Create gallery images
  const gallery = await Promise.all([
    prisma.gallery.upsert({
      where: { id: 'control-room' },
      update: {},
      create: {
        id: 'control-room',
        title: 'Security Control Room',
        description: 'State-of-the-art monitoring and surveillance center',
        image: '/images/gallery/control-room.jpg',
        category: 'FACILITIES',
        tags: ['monitoring', 'surveillance', 'technology'],
        featured: true,
        order: 1,
      },
    }),
    prisma.gallery.upsert({
      where: { id: 'mobile-patrol' },
      update: {},
      create: {
        id: 'mobile-patrol',
        title: 'Mobile Patrol Unit',
        description: 'Our professional mobile patrol vehicles',
        image: '/images/gallery/patrol-car.jpg',
        category: 'EQUIPMENT',
        tags: ['patrol', 'mobile', 'response'],
        featured: true,
        order: 2,
      },
    }),
    prisma.gallery.upsert({
      where: { id: 'team-training' },
      update: {},
      create: {
        id: 'team-training',
        title: 'Security Team Training',
        description: 'Ongoing professional development and training',
        image: '/images/gallery/training.jpg',
        category: 'TRAINING',
        tags: ['training', 'professional', 'development'],
        order: 3,
      },
    }),
    prisma.gallery.upsert({
      where: { id: 'access-control-install' },
      update: {},
      create: {
        id: 'access-control-install',
        title: 'Access Control Installation',
        description: 'Installing advanced access control systems',
        image: '/images/gallery/access-control.jpg',
        category: 'INSTALLATION',
        tags: ['access control', 'installation', 'systems'],
        order: 4,
      },
    }),
    prisma.gallery.upsert({
      where: { id: 'event-security' },
      update: {},
      create: {
        id: 'event-security',
        title: 'Event Security Detail',
        description: 'Professional event security services',
        image: '/images/gallery/event-security.jpg',
        category: 'SERVICES',
        tags: ['events', 'security', 'crowd control'],
        order: 5,
      },
    }),
    prisma.gallery.upsert({
      where: { id: 'corporate-meeting' },
      update: {},
      create: {
        id: 'corporate-meeting',
        title: 'Corporate Security Meeting',
        description: 'Strategy meeting with corporate clients',
        image: '/images/gallery/corporate-meeting.jpg',
        category: 'CORPORATE',
        tags: ['corporate', 'meeting', 'strategy'],
        order: 6,
      },
    }),
  ]);

  console.log('Gallery items created:', gallery.length);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });