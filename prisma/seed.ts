/** @format */

import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

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

  console.log("✅ All existing data cleared");

  // Create admin user for Falcon Security Limited
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.admin.create({
    data: {
      name: "Falcon Security Admin",
      email: "admin@falconslimited.com",
      password: hashedPassword,
      role: "superadmin",
      isActive: true,
    },
  });

  // Create a user for projects and contacts
  const user = await prisma.user.create({
    data: {
      name: "Falcon Security Limited",
      email: "info@falconslimited.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("✅ Admin created:", admin.email);
  console.log("✅ User created:", user.email);

  // =====================================================
  // SERVICES - Real Falcon® Security Limited services
  // =====================================================
  const services = await Promise.all([
    prisma.service.create({
      data: {
        title: "Executive Protection",
        description:
          "We have designed our executive protection group with the finest security personnel. They are trained to remain vigilant, proactive, clue full, at the same time calm and with presence of mind. Always ready to protect any individual exposed to threat. At Falcon®, the Executive Protection personnel are specially trained to handle all kinds of threat perceptions and intelligence gathering.\n\nFalcon® has successfully handled a number of clients providing personal and executive protection on high profile individuals. We always took care to keep intrusion or disturbance of our customers' normal day to day functioning to a minimum, without compromising on safety and efficiency. Our team is always ready to provide executive protection service to any Government officials Delegations, Politicians, Models, Celebrities, Diplomats, foreign envoys and so on.",
        icon: "ShieldCheckIcon",
        features: [
          "VVIP security & personal protection",
          "Threat perception & intelligence gathering",
          "Protection for government officials & diplomats",
          "Celebrity & executive bodyguard services",
          "Minimal intrusion on daily activities",
          "Trained for all kinds of threat scenarios",
        ],
        active: true,
        featured: true,
        order: 1,
      },
    }),
    prisma.service.create({
      data: {
        title: "Manned Guard Service",
        description:
          "Our manned guarding service is the biggest division of the company. Over 30% of Falcon® guard force are deployed in contracts where highly skilled work under stringent safety and security standard are maintained. This has led us to years of experience in Health Environment Safety (HES) training, for which the guard force has become fully compliant.\n\nFalcon® provides male and female security guards at Industrial premises, large corporate buildings, offices, banks, NGOs, construction sites, homes, apartments, events etc. Guards can be provided for any time of the day in 8 hour shifts as per requirement of the client.\n\nWe also provide executive protection service for both local and expats as bodyguards and escorts. The company also provides peons, tea boys, maintenance staff, messengers and drivers who are well trained to cater to the needs of the clients.",
        icon: "UserGroupIcon",
        features: [
          "Male & female security guards",
          "Industrial premises & corporate buildings",
          "Banks, NGOs & construction sites",
          "8 hour shift deployment",
          "Health Environment Safety (HES) compliant",
          "Auxiliary services: peons, drivers, maintenance staff",
        ],
        active: true,
        featured: true,
        order: 2,
      },
    }),
    prisma.service.create({
      data: {
        title: "Risk Consulting",
        description:
          "Falcon's® Risk Consulting supports clients to evaluate and understand the risks they and their organisations may face, acting to mitigate these risks wherever possible, and providing the tools to fully prepare clients to react successfully to a crisis should it occur.\n\nWe offer trusted security advice, risk mitigation strategies, secure support and integrated solutions for strategic clients or those operating in complex or sensitive environments. Whether threats are from crime or terrorism, we work to design and implement effective measures to mitigate or manage these risks.\n\nEVERY SOLUTION STARTS WITH UNDERSTANDING THE THREAT. Our team of experts provide insight and intelligence into the threats that our clients face.",
        icon: "MagnifyingGlassIcon",
        features: [
          "Proactive intelligence gathering & analysis",
          "World class risk advisory & mitigation",
          "Crisis management & response capability",
          "Expert advice on risk management technologies",
          "Specialist training & capacity building",
          "Business resilience development",
        ],
        active: true,
        featured: true,
        order: 3,
      },
    }),
    prisma.service.create({
      data: {
        title: "Escort Service",
        description:
          "Our escort service includes countrywide safeguarding the valuables in transit. A team of trained and vigilant personnel will ensure that your consignment has reached its destination. Our central monitoring cell continuously tracks consignment's location. Our own tracking system, with geo fencing technology assures that your consignment is maintaining predetermined route and time. Currently we are escorting more than 5500 countrywide consignments a year.",
        icon: "TruckIcon",
        features: [
          "Countrywide consignment safeguarding",
          "Central monitoring cell tracking",
          "Geo fencing technology",
          "Predetermined route & time assurance",
          "5500+ consignments escorted yearly",
          "Trained & vigilant escort personnel",
        ],
        active: true,
        featured: true,
        order: 4,
      },
    }),
    prisma.service.create({
      data: {
        title: "Event Security Management",
        description:
          "We put up special security arrangements for events. We train personnel in ensuring security at the main entry/exit gates, drop zone, receptions, parking etc. Depending on crowd and nature of event we set up temporary CCTV systems, scanners and access control systems. Special security arrangements are made for events held by corporate companies for AGM, concerts, social and private gathering, sports events, etc. Falcon® was the security partner of \"RunBangla International 10K 2020\".",
        icon: "CalendarIcon",
        features: [
          "Entry/exit gate security management",
          "Temporary CCTV & scanner systems",
          "Access control for events",
          "Corporate AGM & concert security",
          "Sports event security management",
          "Security partner of RunBangla International 10K",
        ],
        active: true,
        order: 5,
      },
    }),
    prisma.service.create({
      data: {
        title: "Integration (PSIM)",
        description:
          "Our growing focus on integrated, technology-enabled solutions creates additional security and efficiency benefits to customers and increases our ability to differentiate Falcon's® offering in the security market, which in turn supports our goal of accelerating growth. We are platinum distributor partner of ISM UK in (PSIM) physical security information management. We offer state of art and scalable integration solution to our clients.",
        icon: "CpuChipIcon",
        features: [
          "Platinum distributor partner of ISM UK",
          "Physical Security Information Management (PSIM)",
          "Technology-enabled integrated solutions",
          "State of art & scalable solutions",
          "System integration expertise",
          "Security & efficiency optimization",
        ],
        active: true,
        order: 6,
      },
    }),
    prisma.service.create({
      data: {
        title: "Digital Surveillance",
        description:
          "We provide wide range of digital security and surveillance equipment and maintenance services to our clients. We maintain a pool of leading brands of digital security market. Our focus is to provide the best of the solutions that befits client's security needs. Video surveillance systems, access control systems, fire detection and protection systems, perimeter intrusion detection systems, different scanning systems and also design and built systems that can be engaged to increase security efficiency.",
        icon: "VideoCameraIcon",
        features: [
          "CCTV systems (Analogue, IP, PTZ, Thermal)",
          "Access control systems",
          "Fire detection & protection systems",
          "Perimeter intrusion detection",
          "Video analytics & video wall solutions",
          "DVR, NVR, XVR systems",
        ],
        active: true,
        featured: true,
        order: 7,
      },
    }),
    prisma.service.create({
      data: {
        title: "Video Surveillance (CCTV)",
        description:
          "Falcon® stands out in the CCTV market for several reasons: We provide project consulting where our experts provide a comprehensive project assessment to determine the needs of your business. We provide free security audits using blueprints, digital photos, sketches, and online satellite imagery. For customers with complex technology or security requirements, our sales engineers have extensive expertise in security & IT technology.\n\nWe have a wide range of CCTV system solutions including analogue cameras, IP cameras, PTZ cameras, 360 degree cameras, GSM based cameras, thermal cameras, face detection cameras, DVR, NVR, XVR, video analytics and video wall solutions.",
        icon: "EyeIcon",
        features: [
          "Free security audit & project consulting",
          "System integration for complex requirements",
          "Analogue, IP, PTZ & thermal cameras",
          "Face detection & 360 degree cameras",
          "Video analytics & wall solutions",
          "Comprehensive project assessment",
        ],
        active: true,
        order: 8,
      },
    }),
    prisma.service.create({
      data: {
        title: "Access Control",
        description:
          "Access control is the process of regulating who can access certain resources, such as information, files, systems, networks, or physical spaces. Access control involves the implementation of security policies and mechanisms to prevent unauthorized access and ensure that only authorized individuals or entities can access the resources they need.\n\nPhysical access control regulates who can enter a physical space, such as a building, room, or storage area. It can involve using keys, access cards, biometric identification, or other methods. Logical access control regulates who can access digital resources using passwords, security tokens, or other authentication mechanisms. Administrative access control regulates who has administrative privileges based on job responsibilities.\n\nAccess control is an essential part of any security strategy, as it helps to prevent unauthorized access and protect sensitive information and resources from theft, damage, or misuse.",
        icon: "LockClosedIcon",
        features: [
          "Physical access control (keys, cards, biometric)",
          "Logical access control (passwords, tokens)",
          "Administrative access control & role management",
          "Building & room access regulation",
          "Digital resource access management",
          "Security policy implementation",
        ],
        active: true,
        featured: true,
        order: 9,
      },
    }),
  ]);

  console.log("✅ Services created:", services.length);

  // =====================================================
  // CLIENT TESTIMONIALS
  // =====================================================
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: "Multinational Corporation Client",
        company: "International Organization",
        position: "Security Director",
        testimonial:
          "Falcon Security Limited has been our trusted security partner for over a decade. Their armed and manned guard services are of the highest standard, and their professionalism is unmatched in Bangladesh.",
        rating: 5,
        projectType: "Manned Guard Service",
        featured: true,
        active: true,
      },
    }),
    prisma.client.create({
      data: {
        name: "Corporate Office Client",
        company: "Leading Bank",
        position: "Head of Administration",
        testimonial:
          "The security guards provided by Falcon® are well-trained, disciplined, and maintain the highest standards of professionalism. Their HES compliance gives us complete confidence.",
        rating: 5,
        projectType: "Corporate Security",
        featured: true,
        active: true,
      },
    }),
    prisma.client.create({
      data: {
        name: "Industrial Client",
        company: "Manufacturing Company",
        position: "Operations Manager",
        testimonial:
          "Falcon® has provided comprehensive security for our industrial premises since 2005. Their escort services for our countrywide consignments have been flawless with zero incidents.",
        rating: 5,
        projectType: "Escort Service",
        featured: true,
        active: true,
      },
    }),
    prisma.client.create({
      data: {
        name: "NGO Client",
        company: "International NGO",
        position: "Country Director",
        testimonial:
          "The executive protection and risk consulting services from Falcon® have been invaluable for our operations in Bangladesh. Their retired military officers bring unparalleled expertise.",
        rating: 5,
        projectType: "Executive Protection",
        featured: true,
        active: true,
      },
    }),
    prisma.client.create({
      data: {
        name: "Event Organizer",
        company: "Events Management Company",
        position: "Managing Director",
        testimonial:
          "Falcon® was the security partner for RunBangla International 10K 2020 and delivered exceptional event security management. Their crowd control and coordination were outstanding.",
        rating: 5,
        projectType: "Event Security",
        featured: true,
        active: true,
      },
    }),
    prisma.client.create({
      data: {
        name: "Real Estate Developer",
        company: "Construction Group",
        position: "Project Director",
        testimonial:
          "Falcon® provides excellent security at our construction sites with their trained guards. The digital surveillance systems they installed have enhanced our overall security posture.",
        rating: 5,
        projectType: "Construction & Digital Surveillance",
        featured: false,
        active: true,
      },
    }),
    prisma.client.create({
      data: {
        name: "Diplomatic Client",
        company: "Foreign Embassy",
        position: "Security Attaché",
        testimonial:
          "Falcon® understands the unique security needs of diplomatic missions. Their personnel are discreet, professional, and well-versed in VVIP security protocols.",
        rating: 5,
        projectType: "VVIP Security",
        featured: false,
        active: true,
      },
    }),
  ]);

  console.log("✅ Clients created:", clients.length);

  // =====================================================
  // GALLERY
  // =====================================================
  const gallery = await Promise.all([
    prisma.gallery.create({
      data: {
        title: "Falcon® Head Office",
        description:
          "House # 155, Lane # 3, Eastern Road, New D.O.H.S. Mohakhali, Dhaka 1206",
        image:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
        category: "FACILITIES",
        tags: ["headquarters", "dhaka", "office"],
        featured: true,
        order: 1,
      },
    }),
    prisma.gallery.create({
      data: {
        title: "Manned Guard Service",
        description:
          "Professional uniformed security guards deployed at client premises",
        image:
          "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&h=600&fit=crop",
        category: "TEAM",
        tags: ["guards", "manned-security", "professional"],
        featured: true,
        order: 2,
      },
    }),
    prisma.gallery.create({
      data: {
        title: "Training Center",
        description:
          "Falcon® Training Center at 6715 Gaoir Madrasa, Dakkhinkhan, Dhaka",
        image:
          "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&h=600&fit=crop",
        category: "TRAINING",
        tags: ["training", "facility", "dakkhinkhan"],
        featured: true,
        order: 3,
      },
    }),
    prisma.gallery.create({
      data: {
        title: "Digital Surveillance Systems",
        description:
          "CCTV, access control, and integrated security solutions installed by Falcon®",
        image:
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop",
        category: "TECHNOLOGY",
        tags: ["cctv", "surveillance", "digital-security"],
        featured: true,
        order: 4,
      },
    }),
    prisma.gallery.create({
      data: {
        title: "Event Security Operations",
        description:
          "Security arrangements for corporate events, concerts, and sports events",
        image:
          "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
        category: "SERVICES",
        tags: ["event", "crowd-control", "security"],
        featured: false,
        order: 5,
      },
    }),
    prisma.gallery.create({
      data: {
        title: "Executive Protection Detail",
        description:
          "Close protection services for VVIPs, diplomats, and high-profile individuals",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        category: "SERVICES",
        tags: ["executive-protection", "vvip", "bodyguard"],
        featured: false,
        order: 6,
      },
    }),
    prisma.gallery.create({
      data: {
        title: "Escort & Transit Security",
        description:
          "Countrywide consignment escort with GPS tracking and geo-fencing",
        image:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        category: "SERVICES",
        tags: ["escort", "transit", "consignment"],
        featured: false,
        order: 7,
      },
    }),
    prisma.gallery.create({
      data: {
        title: "Access Control Systems",
        description:
          "Biometric access control, card readers, and physical access management",
        image:
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop",
        category: "TECHNOLOGY",
        tags: ["access-control", "biometric", "security-systems"],
        featured: false,
        order: 8,
      },
    }),
  ]);

  console.log("✅ Gallery items created:", gallery.length);

  // =====================================================
  // COMPANY SETTINGS - Real Falcon® details
  // =====================================================
  const settings = await Promise.all([
    prisma.settings.create({
      data: {
        key: "company_name",
        value: "Falcon® Security Limited",
        type: "text",
        description: "Company name",
      },
    }),
    prisma.settings.create({
      data: {
        key: "company_tagline",
        value: "Your Security is Our Priority",
        type: "text",
        description: "Company tagline",
      },
    }),
    prisma.settings.create({
      data: {
        key: "company_description",
        value:
          "Falcon® Security Limited is a security, planning, management and service company enjoying the confidence of our clientele. Retired officers of the Bangladesh Army having adequate training on security and related matters, both from home and abroad, among others manage the services of the company. Our experience includes VVIP security, protection planning of key point installation (KPI), aviation security, planning and securing big industrial projects from its inception till operation.",
        type: "textarea",
        description: "Company description",
      },
    }),
    prisma.settings.create({
      data: {
        key: "contact_phone",
        value: "+8801618325266",
        type: "text",
        description: "Primary contact phone",
      },
    }),
    prisma.settings.create({
      data: {
        key: "contact_email",
        value: "info@falconslimited.com",
        type: "text",
        description: "Primary contact email",
      },
    }),
    prisma.settings.create({
      data: {
        key: "secondary_email",
        value: "falconslimited@gmail.com",
        type: "text",
        description: "Secondary contact email",
      },
    }),
    prisma.settings.create({
      data: {
        key: "office_address",
        value:
          "House # 155, Lane # 3, Eastern Road, New D.O.H.S. Mohakhali, Dhaka 1206, Bangladesh",
        type: "text",
        description: "Head office address",
      },
    }),
    prisma.settings.create({
      data: {
        key: "years_experience",
        value: "33",
        type: "number",
        description: "Years of experience (since 1993)",
      },
    }),
    prisma.settings.create({
      data: {
        key: "clients_served",
        value: "500+",
        type: "text",
        description: "Number of clients served",
      },
    }),
    prisma.settings.create({
      data: {
        key: "founded_year",
        value: "1993",
        type: "number",
        description: "Year company was founded",
      },
    }),
  ]);

  console.log("✅ Settings created:", settings.length);

  // =====================================================
  // BANNERS
  // =====================================================
  const banners = await Promise.all([
    prisma.banner.create({
      data: {
        title: "Falcon® Security Limited",
        subtitle:
          "A security, planning, management and service company since 1993. Your security is our priority.",
        image:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=700&fit=crop&crop=center",
        buttonText: "Our Services",
        buttonUrl: "/services",
        order: 1,
        active: true,
      },
    }),
    prisma.banner.create({
      data: {
        title: "Professional Security Solutions",
        subtitle:
          "VVIP security, manned guarding, digital surveillance & risk consulting by retired Bangladesh Army officers",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=700&fit=crop&crop=center",
        buttonText: "Contact Us",
        buttonUrl: "/contact",
        order: 2,
        active: true,
      },
    }),
    prisma.banner.create({
      data: {
        title: "Three Decades of Trust & Excellence",
        subtitle:
          "Operational since 1993 with nationwide coverage — ISO 9001:2015, 18788:2015 & 27001:2013 certified",
        image:
          "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1920&h=700&fit=crop&crop=center",
        buttonText: "About Us",
        buttonUrl: "/about",
        order: 3,
        active: true,
      },
    }),
  ]);

  console.log("✅ Banners created:", banners.length);

  // =====================================================
  // SOCIAL LINKS
  // =====================================================
  const socialLinks = await Promise.all([
    prisma.socialLink.create({
      data: {
        platform: "Facebook",
        url: "https://facebook.com/falconsecurityltd",
        icon: "facebook",
        order: 1,
        active: true,
      },
    }),
    prisma.socialLink.create({
      data: {
        platform: "LinkedIn",
        url: "https://linkedin.com/company/falcon-security-limited",
        icon: "linkedin",
        order: 2,
        active: true,
      },
    }),
    prisma.socialLink.create({
      data: {
        platform: "Twitter",
        url: "https://twitter.com/falconsecltd",
        icon: "twitter",
        order: 3,
        active: true,
      },
    }),
    prisma.socialLink.create({
      data: {
        platform: "Instagram",
        url: "https://instagram.com/falconsecurityltd",
        icon: "instagram",
        order: 4,
        active: true,
      },
    }),
  ]);

  console.log("✅ Social links created:", socialLinks.length);

  // =====================================================
  // ABOUT SECTION - Real company history & info
  // =====================================================
  const about = await prisma.about.create({
    data: {
      title: "About Falcon® Security Limited",
      subtitle: "Your Trusted Security Partner Since 1993",
      description:
        "Falcon® Security Limited is a security, planning, management, and services company enjoying the confidence of our clientele. Retired officers from the Bangladesh Army having adequate training on security and related matters, both from home and abroad, among others, manage the services of the company. Our experience includes VVIP security, protection planning of key point installation (KPI), aviation security, planning, and securing big industrial projects from its inception till operation and providing security and other essential services to expatriate/local companies, offices, factories, residential complexes, and other installations.\n\nFalcon Security was set up as a Proprietorship Company under the management of the present Managing Director in 1993. The company was later registered in 1997 with the registrar of joint-stock companies and firms, Government of Bangladesh as a private limited company. Falcon® logo and name have received the trademark registration from the concerned registrar of the government.\n\nFalcon® Security Limited is the founder member of the Bangladesh Professional Security Service Provider's Association (BPSSPA). The company has been awarded ISO 9001:2015, 18788:2015 & 27001:2013 for practicing international standards in quality management, private security management, and information security management.\n\nBeside conventional guarding service, Falcon® also provides digital surveillance solutions by installing and maintaining CCTV systems, Access Control Systems, Scanning Systems, intrusion detection systems, guard tour management systems and different tracking systems. We are the platinum distributor-partner of ISM UK in integration (PSIM).\n\nOur Policy: The company policy is to provide concentrated and quality services without overstretching our supervisory system. By this, we ensure strict supervision round the clock to maintain the high standard of performance set by us.\n\nFounder's Message: Everything we hold near and dear needs to be protected and cared for. But finding someone worthy enough to ensure the security of the fruits of our hard work, and indeed our very lives and properties, can be difficult. That's where Falcon® comes in.",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
      yearsExp: 33,
      projectsDone: 5500,
      clientsServed: 500,
      awards: [
        "ISO 9001:2015 - Quality Management System",
        "ISO 18788:2015 - Private Security Operations Management",
        "ISO 27001:2013 - Information Security Management",
        "Founder Member - Bangladesh Professional Security Service Provider's Association (BPSSPA)",
        "Platinum Distributor Partner - ISM UK (PSIM)",
        "Trademark Registered - Government of Bangladesh",
      ],
    },
  });

  console.log("✅ About section created");

  // =====================================================
  // BLOG POSTS - Security industry content
  // =====================================================
  const blogs = await Promise.all([
    prisma.blog.create({
      data: {
        title: "Why Professional Security is Essential for Businesses in Bangladesh",
        slug: "professional-security-essential-businesses-bangladesh",
        content:
          "In today's dynamic business environment in Bangladesh, professional security services have become indispensable. With over three decades of experience, Falcon® Security Limited understands the unique security challenges faced by businesses operating in the country.\n\nFrom multinational corporations to local enterprises, the need for trained, professional security personnel has never been greater. Falcon® provides comprehensive manned guarding services with guards who are fully compliant with Health Environment Safety (HES) standards.\n\nOur approach focuses on providing concentrated and quality services without overstretching our supervisory system, ensuring strict supervision round the clock to maintain the high standard of performance we have set. Whether you need security for industrial premises, corporate buildings, banks, NGOs, or construction sites, Falcon® has the expertise and manpower to deliver.",
        excerpt:
          "Understanding why professional security services are essential for businesses in Bangladesh and how Falcon® Security Limited delivers comprehensive protection.",
        coverImage:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop",
        published: true,
        tags: ["security", "bangladesh", "business-security", "professional-guards"],
      },
    }),
    prisma.blog.create({
      data: {
        title: "The Evolution of Digital Surveillance in Security Management",
        slug: "evolution-digital-surveillance-security-management",
        content:
          "Digital surveillance has transformed the security landscape in Bangladesh. Falcon® Security Limited has been at the forefront of this transformation, offering cutting-edge CCTV systems, access control solutions, and integrated security platforms.\n\nAs the platinum distributor partner of ISM UK in Physical Security Information Management (PSIM), Falcon® brings world-class integration solutions to the Bangladesh market. Our range includes analogue cameras, IP cameras, PTZ cameras, thermal cameras, face detection cameras, and comprehensive video analytics.\n\nOur free security audit service allows clients to benefit from a comprehensive assessment using blueprints, digital photos, sketches, and satellite imagery. This ensures that every surveillance system we design is tailored to the specific needs of the client.",
        excerpt:
          "How digital surveillance technology is revolutionizing security management and Falcon® Security's role as a leading provider of integrated solutions in Bangladesh.",
        coverImage:
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop",
        published: true,
        tags: ["digital-surveillance", "cctv", "psim", "technology"],
      },
    }),
    prisma.blog.create({
      data: {
        title: "Event Security: Lessons from RunBangla International 10K 2020",
        slug: "event-security-lessons-runbangla-10k",
        content:
          "Event security requires meticulous planning, coordination, and execution. As the official security partner of RunBangla International 10K 2020, Falcon® Security Limited gained invaluable experience in managing large-scale event security.\n\nOur event security management covers every aspect — from entry/exit gate security and drop zones to reception areas and parking management. Depending on the crowd size and nature of the event, we deploy temporary CCTV systems, scanners, and access control systems.\n\nFor corporate events such as AGMs, concerts, social gatherings, and sports events, our trained personnel ensure the safety of all attendees while maintaining a seamless event experience. Our ability to handle unorthodox situations with ease and professionalism has made us the preferred security partner for major events across Bangladesh.",
        excerpt:
          "Insights into managing large-scale event security and Falcon® Security's experience as the security partner of RunBangla International 10K 2020.",
        coverImage:
          "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop",
        published: true,
        tags: ["event-security", "runbangla", "crowd-management", "sports-events"],
      },
    }),
  ]);

  console.log("✅ Blog posts created:", blogs.length);

  // =====================================================
  // CAREERS
  // =====================================================
  const careers = await Promise.all([
    prisma.career.create({
      data: {
        title: "Security Guard",
        description:
          "Falcon® Security Limited is seeking disciplined and professional security guards for deployment at various client premises across Bangladesh including corporate buildings, industrial sites, banks, and residential complexes.",
        requirements: [
          "Minimum HSC or equivalent education",
          "Good physical fitness",
          "Clean background record",
          "Previous security experience preferred",
          "Willingness to work 8-hour shifts",
          "Good communication skills in Bangla",
          "Discipline and professional demeanor",
        ],
        location: "Dhaka, Bangladesh (Nationwide deployment)",
        type: "full-time",
        salary: "Competitive salary with benefits",
        deadline: new Date("2026-12-31"),
        active: true,
        featured: true,
      },
    }),
    prisma.career.create({
      data: {
        title: "Security Supervisor",
        description:
          "We are looking for experienced security supervisors to lead guard teams at client sites. The ideal candidate has prior military or security force experience and strong leadership capabilities.",
        requirements: [
          "Minimum graduation or equivalent",
          "5+ years of security experience",
          "Previous supervisory experience required",
          "Ex-military or law enforcement preferred",
          "Strong leadership and communication skills",
          "Knowledge of HES standards",
          "Ability to manage teams and handle emergencies",
        ],
        location: "Dhaka, Bangladesh",
        type: "full-time",
        salary: "Attractive package based on experience",
        deadline: new Date("2026-11-30"),
        active: true,
        featured: true,
      },
    }),
    prisma.career.create({
      data: {
        title: "Digital Surveillance Technician",
        description:
          "Falcon® Security Limited is hiring surveillance technicians to install, maintain and troubleshoot CCTV systems, access control systems, and other digital security equipment at client sites across Bangladesh.",
        requirements: [
          "Diploma/BSc in EEE, CSE, or related field",
          "Experience with CCTV installation and maintenance",
          "Knowledge of IP cameras, DVR/NVR systems",
          "Access control system expertise",
          "Troubleshooting and problem-solving skills",
          "Valid driving license preferred",
          "Willingness to travel nationwide",
        ],
        location: "Dhaka, Bangladesh",
        type: "full-time",
        salary: "Competitive salary based on experience",
        deadline: new Date("2026-12-15"),
        active: true,
        featured: false,
      },
    }),
  ]);

  console.log("✅ Career opportunities created:", careers.length);

  // =====================================================
  // PROJECTS / CASE STUDIES
  // =====================================================
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title: "Countrywide Consignment Escort Operations",
        description:
          "Falcon® provides escort services for over 5,500 countrywide consignments per year. Our central monitoring cell continuously tracks each consignment's location using our proprietary tracking system with geo-fencing technology to ensure predetermined routes and timing are maintained.",
        image:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        category: "Escort Service",
        technologies: [
          "GPS Tracking",
          "Geo-fencing Technology",
          "Central Monitoring",
          "Route Management",
        ],
        githubUrl: null,
        liveUrl: null,
        featured: true,
        userId: user.id,
      },
    }),
    prisma.project.create({
      data: {
        title: "RunBangla International 10K 2020 - Event Security",
        description:
          "Falcon® was the official security partner of RunBangla International 10K 2020, managing comprehensive event security including entry/exit gate security, crowd control, temporary CCTV systems, scanner deployment, and access control for thousands of participants.",
        image:
          "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
        category: "Event Security",
        technologies: [
          "Crowd Control",
          "Temporary CCTV",
          "Access Control",
          "Event Coordination",
        ],
        githubUrl: null,
        liveUrl: null,
        featured: true,
        userId: user.id,
      },
    }),
    prisma.project.create({
      data: {
        title: "PSIM Integration Solutions - ISM UK Partnership",
        description:
          "As the platinum distributor partner of ISM UK, Falcon® has implemented Physical Security Information Management (PSIM) integration solutions for major clients, bringing together CCTV, access control, fire detection, and intrusion detection into unified management platforms.",
        image:
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop",
        category: "Integration",
        technologies: [
          "PSIM",
          "System Integration",
          "ISM UK Platform",
          "Multi-system Management",
        ],
        githubUrl: null,
        liveUrl: null,
        featured: true,
        userId: user.id,
      },
    }),
    prisma.project.create({
      data: {
        title: "Industrial Complex Security - Full Service Package",
        description:
          "Comprehensive security deployment for major industrial complexes including manned guarding, digital surveillance installation, access control systems, perimeter intrusion detection, and auxiliary services such as maintenance staff and drivers.",
        image:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
        category: "Manned Guard & Surveillance",
        technologies: [
          "Manned Guarding",
          "CCTV Installation",
          "Access Control",
          "Perimeter Security",
        ],
        githubUrl: null,
        liveUrl: null,
        featured: false,
        userId: user.id,
      },
    }),
  ]);

  console.log("✅ Security projects created:", projects.length);

  // =====================================================
  // CONTACT INQUIRIES (sample)
  // =====================================================
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        name: "Rezaul Karim",
        email: "rezaul@example.com",
        phone: "+8801712345678",
        message:
          "We need manned guard services for our garment factory in Gazipur. Please provide a quote for 24/7 coverage with 12 guards.",
        status: "new",
        userId: user.id,
      },
    }),
    prisma.contact.create({
      data: {
        name: "Sarah Ahmed",
        email: "sarah@ngo-bd.org",
        phone: "+8801898765432",
        message:
          "Our international NGO requires executive protection for visiting delegates. We also need risk consulting for our field operations in rural Bangladesh.",
        status: "new",
        userId: user.id,
      },
    }),
    prisma.contact.create({
      data: {
        name: "Mohammad Rahman",
        email: "rahman@construction-bd.com",
        phone: "+8801556789012",
        message:
          "We need CCTV installation and security guard services for our new construction project in Chittagong. Please share your pricing for digital surveillance systems.",
        status: "new",
        userId: user.id,
      },
    }),
  ]);

  console.log("✅ Contact inquiries created:", contacts.length);

  // =====================================================
  // FAQ ENTRIES - Real company FAQs
  // =====================================================
  const faqs = await Promise.all([
    prisma.fAQ.create({
      data: {
        question: "What services does Falcon® Security Limited offer?",
        answer:
          "Falcon® provides comprehensive security solutions including executive protection, manned guard services, risk consulting, escort services, event security management, digital surveillance (CCTV, access control), PSIM integration solutions, and auxiliary services such as receptionists, drivers, and maintenance staff.",
        category: "Services",
        order: 1,
        active: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: "How long has Falcon® been in operation?",
        answer:
          "Falcon® Security Limited has been operational since 1993 — over three decades of professional security service. The company was set up as a Proprietorship Company in 1993 and was registered as a private limited company in 1997 with the Government of Bangladesh.",
        category: "Company",
        order: 2,
        active: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: "Who manages Falcon® Security Limited?",
        answer:
          "Falcon® is headed by a Management Team composed of retired officers of the Bangladesh Armed Forces who are highly trained, competent, dedicated, professional, and efficient. The team is led by Mrs. Mayeeda Choudhury (Chairperson) and Major Zulfiqar H. Choudhury (Retd) as Managing Director.",
        category: "Management",
        order: 3,
        active: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: "Does Falcon® operate nationwide?",
        answer:
          "Yes, Falcon® has a nationwide operation with regional offices and branches across Bangladesh including Dhaka (Head Office), Chittagong, Khulna, Bogra, Kushtia, Sylhet, and Barishal. Our training center is located at Dakkhinkhan, Dhaka.",
        category: "Coverage",
        order: 4,
        active: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: "What certifications does Falcon® hold?",
        answer:
          "Falcon® Security Limited has been awarded ISO 9001:2015 (Quality Management), ISO 18788:2015 (Private Security Operations Management), and ISO 27001:2013 (Information Security Management). We are also the founder member of BPSSPA and platinum distributor partner of ISM UK.",
        category: "Certifications",
        order: 5,
        active: true,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: "Does Falcon® provide digital surveillance solutions?",
        answer:
          "Yes, Falcon® provides a wide range of digital security and surveillance equipment and maintenance services including CCTV systems (analogue, IP, PTZ, thermal, face detection cameras), access control systems, fire detection systems, perimeter intrusion detection, video analytics, and video wall solutions. We also offer free security audits and project consulting.",
        category: "Technology",
        order: 6,
        active: true,
      },
    }),
  ]);

  console.log("✅ FAQ entries created:", faqs.length);

  // =====================================================
  // NEWSLETTER SUBSCRIBERS (sample)
  // =====================================================
  const newsletters = await Promise.all([
    prisma.newsletter.create({
      data: {
        email: "karim@garments-bd.com",
        name: "Abdul Karim",
        active: true,
      },
    }),
    prisma.newsletter.create({
      data: {
        email: "facilities@bank-bd.com",
        name: "Nasir Uddin",
        active: true,
      },
    }),
    prisma.newsletter.create({
      data: {
        email: "admin@ngo-dhaka.org",
        name: "Fatima Begum",
        active: true,
      },
    }),
    prisma.newsletter.create({
      data: {
        email: "ops@construction-ctg.com",
        name: "Rafiq Ahmed",
        active: true,
      },
    }),
    prisma.newsletter.create({
      data: {
        email: "security@embassy-dhaka.org",
        name: "James Wilson",
        active: true,
      },
    }),
  ]);

  console.log("✅ Newsletter subscribers created:", newsletters.length);

  // =====================================================
  // JOB POSTINGS
  // =====================================================
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: "Security Guard - Corporate Division",
        description:
          "Falcon® Security Limited is recruiting security guards for deployment at corporate offices, banks, and multinational organizations in Dhaka. Guards will be trained at our Dakkhinkhan training facility before deployment.",
        shortDesc:
          "Professional security guards for corporate premises in Dhaka.",
        company: "Falcon® Security Limited",
        location: "Dhaka, Bangladesh",
        jobType: "full-time",
        experienceLevel: "entry-level",
        salary: "Competitive with industry standards",
        requirements: [
          "Minimum HSC education",
          "Good physical fitness",
          "Clean background",
          "Discipline and professionalism",
          "Willingness to work in shifts",
          "Bangla communication skills",
        ],
        benefits: [
          "Training at Falcon® facility",
          "Uniform provided",
          "Festival bonuses",
          "Career advancement opportunities",
          "Health Environment Safety training",
        ],
        skills: [
          "Physical Fitness",
          "Communication",
          "Discipline",
          "Vigilance",
        ],
        remote: false,
        urgent: false,
        active: true,
        applicationDeadline: new Date("2026-12-31"),
      },
    }),
    prisma.job.create({
      data: {
        title: "CCTV & Surveillance Engineer",
        description:
          "We are looking for experienced engineers to join our digital surveillance solutions division. The role involves designing, installing, and maintaining CCTV systems, access control systems, and integrated security solutions for clients across Bangladesh.",
        shortDesc:
          "Engineer for CCTV installation and digital surveillance solutions.",
        company: "Falcon® Security Limited",
        location: "Dhaka, Bangladesh (Travel required)",
        jobType: "full-time",
        experienceLevel: "mid-level",
        salary: "Based on experience and qualifications",
        requirements: [
          "BSc in EEE or related field",
          "2+ years experience with CCTV systems",
          "Knowledge of IP, analogue, PTZ cameras",
          "DVR/NVR configuration expertise",
          "Access control system experience",
          "Troubleshooting skills",
        ],
        benefits: [
          "Competitive salary",
          "Professional development",
          "Work with leading security brands",
          "Travel allowance",
          "Festival bonuses",
        ],
        skills: [
          "CCTV Installation",
          "Network Configuration",
          "Access Control",
          "Troubleshooting",
        ],
        remote: false,
        urgent: true,
        active: true,
        applicationDeadline: new Date("2026-11-30"),
      },
    }),
  ]);

  console.log("✅ Job postings created:", jobs.length);

  // =====================================================
  // SUMMARY
  // =====================================================
  console.log(
    "\n🎉 Database successfully seeded with real Falcon® Security Limited data!",
  );
  console.log("📊 Data Summary:");
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
  console.log("\n📧 Admin login: admin@falconslimited.com");
  console.log("🔑 Password: admin123");
  console.log("\n🏢 Company: Falcon® Security Limited");
  console.log("📍 HQ: House # 155, Lane # 3, Eastern Road, New D.O.H.S. Mohakhali, Dhaka 1206");
  console.log("📞 Phone: +8801618325266");
  console.log("📧 Email: info@falconslimited.com");
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
