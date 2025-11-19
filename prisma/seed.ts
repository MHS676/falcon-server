import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.jobApplication.deleteMany();
  await prisma.job.deleteMany();
  await prisma.application.deleteMany();
  await prisma.career.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.client.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.about.deleteMany();
  await prisma.service.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ All existing data cleared');

  // Create admin user for Falcon Security Limited
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.create({
    data: {
      name: 'Falcon Security Admin',
      email: 'admin@falconsecurity.com',
      password: hashedPassword,
      role: 'superadmin',
      isActive: true,
    },
  });

  // Create a user for projects and contacts
  const user = await prisma.user.create({
    data: {
      name: 'Falcon Security',
      email: 'projects@falconsecurity.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('✅ Admin created:', admin.email);
  console.log('✅ User created:', user.email);

  // Create comprehensive services for Falcon Security Limited
  const services = await Promise.all([
    prisma.service.create({
      data: {
        title: 'Armed Security Guards',
        description: 'Professional armed security personnel for high-risk environments and critical asset protection.',
        icon: 'ShieldCheckIcon',
        features: [
          'Licensed armed officers',
          'Emergency response training',
          'Threat assessment expertise',
          'Corporate security protocols',
          '24/7 deployment availability'
        ],
        price: 'Starting at $35/hour',
        duration: 'Flexible scheduling',
        active: true,
        featured: true,
        order: 1,
      },
    }),
    prisma.service.create({
      data: {
        title: 'Unarmed Security Guards',
        description: 'Trained security personnel for access control, surveillance, and general protection services.',
        icon: 'UserGroupIcon',
        features: [
          'Professional uniformed guards',
          'Access control management',
          'Patrol and surveillance',
          'Incident reporting',
          'Customer service training'
        ],
        price: 'Starting at $22/hour',
        duration: 'Flexible shifts',
        active: true,
        featured: true,
        order: 2,
      },
    }),
    prisma.service.create({
      data: {
        title: 'Mobile Patrol Services',
        description: 'Comprehensive mobile security patrols for multiple locations and large properties.',
        icon: 'TruckIcon',
        features: [
          'Marked security vehicles',
          'GPS tracking & reporting',
          'Alarm response services',
          'Property inspections',
          'Emergency incident response'
        ],
        price: 'Starting at $65/hour',
        duration: 'Customizable routes',
        active: true,
        featured: true,
        order: 3,
      },
    }),
    prisma.service.create({
      data: {
        title: 'Event Security',
        description: 'Specialized security solutions for concerts, corporate events, and private gatherings.',
        icon: 'CalendarIcon',
        features: [
          'Crowd control management',
          'VIP protection services',
          'Bag screening & metal detection',
          'Emergency evacuation planning',
          'Coordination with local authorities'
        ],
        price: 'Custom quotes available',
        duration: 'Event-based pricing',
        active: true,
        order: 4,
      },
    }),
    prisma.service.create({
      data: {
        title: 'Executive Protection',
        description: 'Discreet personal protection services for high-profile individuals and corporate executives.',
        icon: 'UserIcon',
        features: [
          'Personal bodyguard services',
          'Threat assessment & analysis',
          'Secure transportation',
          'Advance security planning',
          'International protection available'
        ],
        price: 'Starting at $75/hour',
        duration: 'Round-the-clock available',
        active: true,
        order: 5,
      },
    }),
    prisma.service.create({
      data: {
        title: 'Corporate Security',
        description: 'Comprehensive security solutions tailored for corporate environments and business facilities.',
        icon: 'BuildingOfficeIcon',
        features: [
          'Reception & lobby security',
          'Employee badge management',
          'Visitor screening protocols',
          'After-hours security',
          'Loss prevention services'
        ],
        price: 'Starting at $28/hour',
        duration: 'Contract-based',
        active: true,
        order: 6,
      },
    }),
    prisma.service.create({
      data: {
        title: 'Retail Security',
        description: 'Specialized loss prevention and customer safety services for retail establishments.',
        icon: 'ShoppingBagIcon',
        features: [
          'Loss prevention specialists',
          'Shoplifting deterrence',
          'Customer assistance',
          'Emergency response',
          'CCTV monitoring'
        ],
        price: 'Starting at $25/hour',
        duration: 'Store hours coverage',
        active: true,
        order: 7,
      },
    }),
    prisma.service.create({
      data: {
        title: 'Construction Site Security',
        description: 'Robust security solutions for construction sites, equipment protection, and site safety.',
        icon: 'WrenchScrewdriverIcon',
        features: [
          'Equipment theft prevention',
          'Site access control',
          '24/7 surveillance',
          'Safety compliance monitoring',
          'Vandalism prevention'
        ],
        price: 'Starting at $30/hour',
        duration: 'Project duration',
        active: true,
        order: 8,
      },
    }),
  ]);

  console.log('✅ Services created:', services.length);

  // Create client testimonials for Falcon Security Limited
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: 'Michael Johnson',
        company: 'Metro Corporate Plaza',
        position: 'Facilities Director',
        testimonial: 'Falcon Security Limited has exceeded our expectations. Their armed guards are highly professional and their response times are exceptional. We feel completely secure with their services.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        rating: 5,
        projectType: 'Corporate Security',
        featured: true,
        active: true,
      },
    }),
    prisma.client.create({
      data: {
        name: 'Sarah Chen',
        company: 'Westfield Shopping Center',
        position: 'Security Manager',
        testimonial: 'The retail security services provided by Falcon Security have significantly reduced theft and created a safer shopping environment. Their guards are courteous and professional.',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        rating: 5,
        projectType: 'Retail Security',
        featured: true,
        active: true,
      },
    }),
    prisma.client.create({
      data: {
        name: 'Robert Davis',
        company: 'City Construction Group',
        position: 'Project Manager',
        testimonial: 'Falcon Security\'s construction site protection has saved us thousands in equipment theft prevention. Their guards are reliable and understand the construction environment well.',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face',
        rating: 5,
        projectType: 'Construction Security',
        featured: true,
        active: true,
      },
    }),
    prisma.client.create({
      data: {
        name: 'Alex Thompson',
        company: 'TechHub Innovation Center',
        position: 'Facilities Manager',
        testimonial: 'Falcon Security\'s mobile patrol services have greatly enhanced our multi-location security. Their detailed reporting keeps us informed at all times.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        rating: 5,
        projectType: 'Mobile Patrol',
        featured: false,
        active: true,
      },
    }),
    prisma.client.create({
      data: {
        name: 'Jennifer Walsh',
        company: 'Elite Events & Conferences',
        position: 'Event Director',
        testimonial: 'Falcon Security\'s event security team is outstanding. They handle crowd control expertly while maintaining a professional and approachable demeanor with our guests.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        rating: 5,
        projectType: 'Event Security',
        featured: true,
        active: true,
      },
    }),
    prisma.client.create({
      data: {
        name: 'David Rodriguez',
        company: 'TechNova Industries',
        position: 'Chief Security Officer',
        testimonial: 'The executive protection services from Falcon Security are top-notch. Their discrete and professional approach gives our leadership team complete confidence.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        rating: 5,
        projectType: 'Executive Protection',
        featured: false,
        active: true,
      },
    }),
    prisma.client.create({
      data: {
        name: 'Dr. Amanda Foster',
        company: 'Central Medical Center',
        position: 'Administrator',
        testimonial: 'Healthcare security requires special expertise, and Falcon Security delivers exactly that. Their guards understand our environment and maintain patient confidentiality.',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
        rating: 5,
        projectType: 'Healthcare Security',
        featured: false,
        active: true,
      },
    }),
  ]);

  console.log('✅ Clients created:', clients.length);

  // Create gallery images for Falcon Security Limited
  const gallery = await Promise.all([
    prisma.gallery.create({
      data: {
        title: 'Security Control Center',
        description: 'State-of-the-art 24/7 monitoring and surveillance command center',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
        category: 'FACILITIES',
        tags: ['monitoring', 'surveillance', 'technology'],
        featured: true,
        order: 1,
      },
    }),
    prisma.gallery.create({
      data: {
        title: 'Armed Security Personnel',
        description: 'Professional armed guards providing high-level security',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        category: 'TEAM',
        tags: ['armed', 'security', 'professional'],
        featured: true,
        order: 2,
      },
    }),
    prisma.gallery.create({
      data: {
        title: 'Mobile Security Patrol',
        description: 'Falcon Security marked patrol vehicles for rapid response',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
        category: 'EQUIPMENT',
        tags: ['patrol', 'mobile', 'response', 'vehicle'],
        featured: true,
        order: 3,
      },
    }),
    prisma.gallery.create({
      data: {
        title: 'Corporate Security Team',
        description: 'Uniformed security officers for corporate environments',
        image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&h=600&fit=crop',
        category: 'TEAM',
        tags: ['corporate', 'uniform', 'professional'],
        featured: true,
        order: 4,
      },
    }),
    prisma.gallery.create({
      data: {
        title: 'Event Security Setup',
        description: 'Security checkpoint and crowd control at corporate event',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
        category: 'SERVICES',
        tags: ['event', 'crowd-control', 'checkpoint'],
        featured: false,
        order: 5,
      },
    }),
    prisma.gallery.create({
      data: {
        title: 'Security Training Exercise',
        description: 'Ongoing professional development and tactical training',
        image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&h=600&fit=crop',
        category: 'TRAINING',
        tags: ['training', 'exercise', 'professional-development'],
        featured: false,
        order: 6,
      },
    }),
    prisma.gallery.create({
      data: {
        title: 'Construction Site Security',
        description: 'Protecting valuable equipment and materials at construction sites',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
        category: 'SERVICES',
        tags: ['construction', 'site-security', 'equipment-protection'],
        featured: false,
        order: 7,
      },
    }),
    prisma.gallery.create({
      data: {
        title: 'Retail Loss Prevention',
        description: 'Discreet security services for retail environments',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
        category: 'SERVICES',
        tags: ['retail', 'loss-prevention', 'surveillance'],
        featured: false,
        order: 8,
      },
    }),
  ]);

  console.log('✅ Gallery items created:', gallery.length);

  // Create company settings for Falcon Security Limited
  const settings = await Promise.all([
    prisma.settings.create({
      data: {
        key: 'company_name',
        value: 'Falcon Security Limited',
        type: 'text',
        description: 'Company name',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'company_tagline',
        value: 'Professional Security Solutions You Can Trust',
        type: 'text',
        description: 'Company tagline',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'company_description',
        value: 'Falcon Security Limited is a premier security services company providing comprehensive protection solutions across corporate, retail, construction, and event sectors. With highly trained personnel and state-of-the-art technology, we deliver unmatched security services tailored to your specific needs.',
        type: 'textarea',
        description: 'Company description',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'contact_phone',
        value: '+1 (555) 123-SECURITY',
        type: 'text',
        description: 'Primary contact phone',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'contact_email',
        value: 'info@falconsecurity.com',
        type: 'text',
        description: 'Primary contact email',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'office_address',
        value: '1234 Security Boulevard, Suite 500, Business District, NY 10001',
        type: 'text',
        description: 'Office address',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'years_experience',
        value: '15',
        type: 'number',
        description: 'Years of experience',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'clients_served',
        value: '500+',
        type: 'text',
        description: 'Number of clients served',
      },
    }),
  ]);

  console.log('✅ Settings created:', settings.length);

  // Create banners for homepage
  const banners = await Promise.all([
    prisma.banner.create({
      data: {
        title: 'Professional Security Solutions',
        subtitle: 'Protecting what matters most with 15+ years of expertise',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=700&fit=crop&crop=center',
        buttonText: 'Our Services',
        buttonUrl: '/services',
        order: 1,
        active: true,
      },
    }),
    prisma.banner.create({
      data: {
        title: '24/7 Armed & Unarmed Security',
        subtitle: 'Licensed professionals ready to protect your business',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=700&fit=crop&crop=center',
        buttonText: 'Contact Us',
        buttonUrl: '/contact',
        order: 2,
        active: true,
      },
    }),
    prisma.banner.create({
      data: {
        title: 'Trusted by 500+ Businesses',
        subtitle: 'From retail stores to corporate offices - we secure it all',
        image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1920&h=700&fit=crop&crop=center',
        buttonText: 'View Gallery',
        buttonUrl: '/gallery',
        order: 3,
        active: true,
      },
    }),
  ]);

  console.log('✅ Banners created:', banners.length);

  // Create social media links
  const socialLinks = await Promise.all([
    prisma.socialLink.create({
      data: {
        platform: 'Facebook',
        url: 'https://facebook.com/falconsecurityltd',
        icon: 'facebook',
        order: 1,
        active: true,
      },
    }),
    prisma.socialLink.create({
      data: {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/company/falcon-security-limited',
        icon: 'linkedin',
        order: 2,
        active: true,
      },
    }),
    prisma.socialLink.create({
      data: {
        platform: 'Twitter',
        url: 'https://twitter.com/falconsecltd',
        icon: 'twitter',
        order: 3,
        active: true,
      },
    }),
    prisma.socialLink.create({
      data: {
        platform: 'Instagram',
        url: 'https://instagram.com/falconsecurityltd',
        icon: 'instagram',
        order: 4,
        active: true,
      },
    }),
  ]);

  console.log('✅ Social links created:', socialLinks.length);

  // Create about section
  const about = await prisma.about.create({
    data: {
      title: 'About Falcon Security Limited',
      subtitle: 'Your Trusted Security Partner Since 2009',
      description: 'Falcon Security Limited has been at the forefront of the security industry for over 15 years, providing comprehensive protection solutions to businesses and individuals across the region. Our team of highly trained, licensed professionals brings unmatched expertise in armed and unarmed security services, mobile patrol, executive protection, and specialized event security.\n\nWe understand that every client has unique security needs. That\'s why we work closely with you to develop customized security plans that address your specific challenges and concerns. From corporate offices and retail establishments to construction sites and special events, we deliver reliable, professional security services you can trust.\n\nOur commitment to excellence is reflected in our rigorous hiring standards, ongoing training programs, and state-of-the-art equipment. We maintain the highest industry certifications and continuously invest in technology and training to stay ahead of emerging security threats.',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
      yearsExp: 15,
      projectsDone: 1200,
      clientsServed: 500,
      awards: [
        'Best Security Company 2023 - Business Excellence Awards',
        'Outstanding Service Award 2022 - Security Industry Association',
        'Safety Excellence Recognition 2021 - Chamber of Commerce',
        'Customer Service Excellence 2020 - Regional Business Council'
      ],
    },
  });

  console.log('✅ About section created');

  // Create sample blog posts
  const blogs = await Promise.all([
    prisma.blog.create({
      data: {
        title: '10 Essential Security Tips for Businesses',
        slug: '10-essential-security-tips-for-businesses',
        content: 'In today\'s rapidly evolving threat landscape, businesses must stay vigilant about security. Here are 10 essential security tips every business should implement...',
        excerpt: 'Essential security measures every business owner should know to protect their assets, employees, and customers.',
        coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
        published: true,
        tags: ['security-tips', 'business-security', 'prevention'],
      },
    }),
    prisma.blog.create({
      data: {
        title: 'The Importance of Mobile Security Patrols',
        slug: 'importance-of-mobile-security-patrols',
        content: 'Mobile security patrols offer a dynamic and cost-effective security solution for businesses with multiple locations or large properties...',
        excerpt: 'Learn how mobile security patrols can enhance your property protection while providing cost-effective coverage.',
        coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop',
        published: true,
        tags: ['mobile-patrol', 'security-solutions', 'property-protection'],
      },
    }),
    prisma.blog.create({
      data: {
        title: 'Event Security: Planning for Success',
        slug: 'event-security-planning-for-success',
        content: 'Successful events require comprehensive security planning. From risk assessment to crowd management, here\'s what you need to know...',
        excerpt: 'A comprehensive guide to planning security for events of all sizes, from corporate meetings to large gatherings.',
        coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop',
        published: true,
        tags: ['event-security', 'crowd-control', 'event-planning'],
      },
    }),
  ]);

  console.log('✅ Blog posts created:', blogs.length);

  // Create career opportunities
  const careers = await Promise.all([
    prisma.career.create({
      data: {
        title: 'Armed Security Officer',
        description: 'We are seeking experienced armed security officers to join our elite protection team. Candidates must be licensed, professional, and committed to excellence in security services.',
        requirements: [
          'Valid armed security license',
          'Minimum 3 years security experience',
          'Clean criminal background check',
          'Excellent communication skills',
          'Physical fitness requirements',
          'Professional appearance and demeanor',
          'Ability to work various shifts including weekends'
        ],
        location: 'New York, NY',
        type: 'full-time',
        salary: '$45,000 - $55,000 annually',
        deadline: new Date('2025-12-31'),
        active: true,
        featured: true,
      },
    }),
    prisma.career.create({
      data: {
        title: 'Mobile Patrol Supervisor',
        description: 'Lead our mobile patrol division and oversee security operations across multiple client locations. This role requires strong leadership skills and extensive security experience.',
        requirements: [
          'Valid driver\'s license with clean record',
          'Security supervisor license',
          'Minimum 5 years security experience',
          '2+ years supervisory experience',
          'Knowledge of security protocols',
          'GPS and technology proficiency',
          'Strong leadership and communication skills'
        ],
        location: 'New York, NY',
        type: 'full-time',
        salary: '$55,000 - $65,000 annually',
        deadline: new Date('2025-11-30'),
        active: true,
        featured: true,
      },
    }),
    prisma.career.create({
      data: {
        title: 'Corporate Security Specialist',
        description: 'Join our corporate security team providing protection services to high-profile business clients. Ideal for professionals seeking a prestigious security role.',
        requirements: [
          'Security officer license',
          'Corporate security experience preferred',
          'Professional business attire',
          'Excellent customer service skills',
          'Technology savvy',
          'Flexible scheduling availability',
          'Bilingual (English/Spanish) preferred'
        ],
        location: 'Manhattan, NY',
        type: 'full-time',
        salary: '$40,000 - $50,000 annually',
        deadline: new Date('2025-12-15'),
        active: true,
        featured: false,
      },
    }),
  ]);

  console.log('✅ Career opportunities created:', careers.length);

  // Create security-related projects/case studies
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title: 'Metro Corporate Plaza Security Upgrade',
        description: 'Comprehensive security system upgrade for a 40-story corporate building including access control, surveillance, and 24/7 armed guard services. Reduced security incidents by 85% within the first year.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
        category: 'Corporate Security',
        technologies: ['Access Control Systems', 'CCTV Surveillance', 'Armed Security', 'Visitor Management'],
        githubUrl: null,
        liveUrl: null,
        featured: true,
        userId: user.id,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Westfield Shopping Center Loss Prevention',
        description: 'Implemented comprehensive loss prevention program including undercover security, surveillance monitoring, and theft deterrence strategies. Achieved 60% reduction in retail theft.',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
        category: 'Retail Security',
        technologies: ['Loss Prevention', 'Undercover Security', 'Retail Surveillance', 'Theft Deterrence'],
        githubUrl: null,
        liveUrl: null,
        featured: true,
        userId: user.id,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Construction Site Protection Program',
        description: 'Developed and executed security program for major construction project protecting $50M+ in equipment and materials. Zero theft incidents over 18-month project duration.',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
        category: 'Construction Security',
        technologies: ['Site Security', 'Equipment Protection', 'Access Control', '24/7 Monitoring'],
        githubUrl: null,
        liveUrl: null,
        featured: true,
        userId: user.id,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Executive Protection Services',
        description: 'Provided discrete executive protection for Fortune 500 CEO including risk assessment, secure transportation, and event security coordination.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        category: 'Executive Protection',
        technologies: ['Executive Protection', 'Risk Assessment', 'Secure Transportation', 'Event Coordination'],
        githubUrl: null,
        liveUrl: null,
        featured: false,
        userId: user.id,
      },
    }),
  ]);

  console.log('✅ Security projects created:', projects.length);

  // Create sample contacts/inquiries
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        name: 'John Mitchell',
        email: 'j.mitchell@techcorp.com',
        message: 'We need armed security services for our corporate headquarters. Please provide a quote for 24/7 coverage.',
        status: 'in-progress',
        userId: user.id,
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Sandra Williams',
        email: 'sandra@retailchain.com',
        message: 'Interested in loss prevention services for our retail locations. Can you provide information about your retail security packages?',
        status: 'responded',
        userId: user.id,
      },
    }),
    prisma.contact.create({
      data: {
        name: 'David Construction LLC',
        email: 'info@davidconstruction.com',
        message: 'We need security for our construction sites. Equipment theft has been a problem. What solutions do you offer?',
        status: 'responded',
        userId: user.id,
      },
    }),
  ]);

  console.log('✅ Contact inquiries created:', contacts.length);

  // Create FAQ entries
  const faqs = await Promise.all([
    prisma.fAQ.create({
      data: {
        question: 'What types of security services does Falcon Security Limited offer?',
        answer: 'We provide comprehensive security solutions including armed and unarmed security guards, mobile patrol services, executive protection, event security, corporate security, retail loss prevention, and construction site security.',
        category: 'Services',
        order: 1,
        active: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Are your security guards licensed and insured?',
        answer: 'Yes, all our security personnel are fully licensed, bonded, and insured. We maintain comprehensive liability insurance and ensure all guards meet state licensing requirements.',
        category: 'Licensing',
        order: 2,
        active: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Do you provide 24/7 security services?',
        answer: 'Absolutely. Falcon Security Limited operates 24/7, 365 days a year. We can provide round-the-clock coverage for all your security needs.',
        category: 'Availability',
        order: 3,
        active: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'How quickly can you deploy security personnel?',
        answer: 'We can typically deploy security personnel within 24-48 hours for most assignments. For emergency situations, we offer same-day deployment when available.',
        category: 'Response Time',
        order: 4,
        active: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'What areas do you serve?',
        answer: 'We primarily serve the New York metropolitan area including Manhattan, Brooklyn, Queens, Bronx, and surrounding counties. Contact us for coverage in other areas.',
        category: 'Coverage',
        order: 5,
        active: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: 'Do you provide security equipment and technology?',
        answer: 'Yes, we provide state-of-the-art security equipment including surveillance cameras, access control systems, alarm systems, and mobile patrol vehicles equipped with GPS tracking.',
        category: 'Technology',
        order: 6,
        active: true,
      },
    }),
  ]);

  console.log('✅ FAQ entries created:', faqs.length);

  // Create newsletter subscribers
  const newsletters = await Promise.all([
    prisma.newsletter.create({
      data: {
        email: 'businessowner@example.com',
        name: 'Mike Johnson',
        active: true,
      },
    }),
    prisma.newsletter.create({
      data: {
        email: 'security.manager@corp.com',
        name: 'Lisa Chen',
        active: true,
      },
    }),
    prisma.newsletter.create({
      data: {
        email: 'facilities@shopping-center.com',
        name: 'Robert Davis',
        active: true,
      },
    }),
    prisma.newsletter.create({
      data: {
        email: 'info@construction-company.com',
        name: 'Jennifer Walsh',
        active: true,
      },
    }),
    prisma.newsletter.create({
      data: {
        email: 'admin@medical-center.com',
        name: 'Dr. Amanda Foster',
        active: true,
      },
    }),
  ]);

  console.log('✅ Newsletter subscribers created:', newsletters.length);

  // Create job postings (additional to careers)
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: 'Event Security Coordinator',
        description: 'Coordinate security operations for concerts, corporate events, and private gatherings. Manage security teams and ensure safe event execution.',
        shortDesc: 'Lead event security operations and coordinate with teams for safe event execution.',
        company: 'Falcon Security Limited',
        location: 'New York, NY',
        jobType: 'full-time',
        experienceLevel: 'mid-level',
        salary: '$50,000 - $60,000',
        requirements: [
          'Event security experience',
          'Team leadership skills',
          'Crowd control knowledge',
          'Emergency response training',
          'Excellent communication',
          'Weekend availability'
        ],
        benefits: [
          'Health insurance',
          'Paid time off',
          'Training opportunities',
          'Career advancement',
          'Overtime pay',
          '401k plan'
        ],
        skills: ['Event Management', 'Team Leadership', 'Crowd Control', 'Emergency Response'],
        remote: false,
        urgent: false,
        active: true,
        applicationDeadline: new Date('2025-12-20'),
      },
    }),
    prisma.job.create({
      data: {
        title: 'Loss Prevention Specialist',
        description: 'Prevent theft and reduce shrinkage in retail environments. Work undercover and coordinate with store management to implement loss prevention strategies.',
        shortDesc: 'Prevent retail theft through surveillance and loss prevention techniques.',
        company: 'Falcon Security Limited',
        location: 'Brooklyn, NY',
        jobType: 'full-time',
        experienceLevel: 'entry-level',
        salary: '$35,000 - $42,000',
        requirements: [
          'Retail experience preferred',
          'Observational skills',
          'Report writing abilities',
          'Professional appearance',
          'Flexible schedule',
          'Loss prevention training'
        ],
        benefits: [
          'Health insurance',
          'Paid training',
          'Career growth',
          'Performance bonuses',
          'Flexible hours'
        ],
        skills: ['Loss Prevention', 'Surveillance', 'Report Writing', 'Retail Knowledge'],
        remote: false,
        urgent: true,
        active: true,
        applicationDeadline: new Date('2025-11-25'),
      },
    }),
  ]);

  console.log('✅ Job postings created:', jobs.length);

  console.log('\n🎉 Database successfully seeded with comprehensive Falcon Security Limited data!');
  console.log('📊 Data Summary:');
  console.log(`   • Services: ${services.length}`);
  console.log(`   • Clients: ${clients.length}`);
  console.log(`   • Gallery: ${gallery.length}`);
  console.log(`   • Settings: ${settings.length}`);
  console.log(`   • Banners: ${banners.length}`);
  console.log(`   • Social Links: ${socialLinks.length}`);
  console.log(`   • Blog Posts: ${blogs.length}`);
  console.log(`   • Career Opportunities: ${careers.length}`);
  console.log(`   • Security Projects: ${projects.length}`);
  console.log(`   • Contact Inquiries: ${contacts.length}`);
  console.log(`   • FAQ Entries: ${faqs.length}`);
  console.log(`   • Newsletter Subscribers: ${newsletters.length}`);
  console.log(`   • Job Postings: ${jobs.length}`);
  console.log('\n📧 Admin login: admin@falconsecurity.com');
  console.log('🔑 Password: admin123');
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