-- Falcon Security Limited - Realistic Seed Data
-- Run this SQL to populate your database with company data

-- Clear existing data (optional)
-- TRUNCATE TABLE "Application", "Career", "Employee", "Service", "Blog", "Contact", "Client", "Gallery", "Banner" CASCADE;

-- ============================================
-- SERVICES
-- ============================================
INSERT INTO "Service" ("id", "title", "description", "icon", "features", "price", "duration", "active", "featured", "order", "createdAt", "updatedAt") VALUES
('srv-001', 'Armed Security Guards', 'Professional armed security personnel for high-risk facilities and VIP protection. Our trained guards ensure maximum safety and deterrence.', 'shield-check', ARRAY['24/7 Availability', 'Licensed Firearms', 'Tactical Training', 'Emergency Response', 'Risk Assessment'], 'BDT 45,000 - 60,000/month', '12 months contract', true, true, 1, NOW(), NOW()),
('srv-002', 'Unarmed Security Guards', 'Reliable unarmed security services for offices, residential areas, shopping malls, and events.', 'user-shield', ARRAY['Professional Uniforms', 'Access Control', 'Patrol Services', 'Incident Reporting', 'Customer Service'], 'BDT 25,000 - 35,000/month', 'Flexible contracts', true, true, 2, NOW(), NOW()),
('srv-003', 'CCTV Surveillance', 'Advanced CCTV installation, monitoring, and maintenance services with 24/7 control room support.', 'camera', ARRAY['HD Cameras', '24/7 Monitoring', 'Cloud Storage', 'Mobile Access', 'Monthly Reports'], 'BDT 80,000 - 150,000 (one-time)', '1 year warranty', true, true, 3, NOW(), NOW()),
('srv-004', 'Event Security', 'Specialized security solutions for corporate events, weddings, concerts, and public gatherings.', 'calendar', ARRAY['Crowd Management', 'VIP Protection', 'Access Control', 'Emergency Planning', 'Professional Team'], 'BDT 15,000 - 50,000/event', 'Per event basis', true, false, 4, NOW(), NOW()),
('srv-005', 'Residential Security', 'Comprehensive security services for residential complexes, apartments, and gated communities.', 'home', ARRAY['Gate Security', 'Visitor Management', 'Patrol Services', 'Package Handling', 'Emergency Response'], 'BDT 30,000 - 45,000/month', '6-12 months', true, false, 5, NOW(), NOW()),
('srv-006', 'Corporate Security', 'Tailored security solutions for corporate offices, banks, and commercial establishments.', 'building-office', ARRAY['Access Control Systems', 'Executive Protection', 'Asset Protection', 'Risk Management', 'Security Audits'], 'Custom Quote', 'Annual contracts', true, true, 6, NOW(), NOW()),
('srv-007', 'Industrial Security', 'Heavy-duty security for factories, warehouses, construction sites, and industrial facilities.', 'wrench-screwdriver', ARRAY['Perimeter Security', 'Asset Monitoring', 'Fire Watch', 'Safety Compliance', 'Inventory Control'], 'BDT 50,000 - 80,000/month', '12-24 months', true, false, 7, NOW(), NOW()),
('srv-008', 'Mobile Patrol', 'Regular mobile patrol services for multiple locations with detailed reporting and monitoring.', 'truck', ARRAY['Random Patrols', 'GPS Tracking', 'Alarm Response', 'Property Checks', 'Detailed Reports'], 'BDT 20,000 - 35,000/month', 'Monthly contracts', true, false, 8, NOW(), NOW());

-- ============================================
-- CAREERS / JOB POSTINGS
-- ============================================
INSERT INTO "Career" ("id", "title", "description", "requirements", "location", "type", "salary", "deadline", "active", "featured", "createdAt", "updatedAt") VALUES
('job-001', 'Armed Security Guard', 'Falcon Security Limited is seeking experienced armed security guards for corporate and VIP protection assignments. Must have valid firearms license and prior security experience.', ARRAY['Valid firearms license', 'Minimum 2 years security experience', 'Bangladesh citizenship', 'Age 21-40 years', 'Good physical fitness', 'Clean criminal record', 'High school diploma'], 'Dhaka, Bangladesh', 'full-time', 'BDT 30,000 - 35,000', '2025-12-31T23:59:59.000Z', true, true, NOW(), NOW()),
('job-002', 'Security Supervisor', 'We are looking for an experienced security supervisor to manage a team of 15-20 security guards at a corporate facility. Leadership skills essential.', ARRAY['5+ years security industry experience', 'Previous supervisory experience', 'Excellent communication skills', 'Computer literate', 'Problem-solving abilities', 'Valid security license'], 'Dhaka, Gulshan Area', 'full-time', 'BDT 45,000 - 55,000', '2025-12-15T23:59:59.000Z', true, true, NOW(), NOW()),
('job-003', 'CCTV Operator', 'Seeking alert and detail-oriented CCTV operators for 24/7 control room monitoring. Must be able to work in shifts.', ARRAY['Basic computer skills', 'Good eyesight', 'Attention to detail', 'Ability to work night shifts', 'SSC/HSC passed', 'Previous CCTV experience (preferred)'], 'Dhaka, Banani', 'full-time', 'BDT 22,000 - 28,000', '2025-11-30T23:59:59.000Z', true, false, NOW(), NOW()),
('job-004', 'Security Guard (Unarmed)', 'Multiple positions available for unarmed security guards at residential and commercial properties across Dhaka.', ARRAY['Age 21-45 years', 'Physically fit', 'Good communication', 'Honest and reliable', 'Any educational background', 'Willing to work in shifts'], 'Dhaka (Multiple Locations)', 'full-time', 'BDT 18,000 - 25,000', '2026-01-15T23:59:59.000Z', true, true, NOW(), NOW()),
('job-005', 'Security Manager', 'Senior position for experienced security professional to oversee all security operations and manage multiple client accounts.', ARRAY['10+ years security management', 'Bachelor degree preferred', 'Strong leadership skills', 'Budget management experience', 'Excellent communication', 'Strategic planning abilities'], 'Dhaka, Corporate Office', 'full-time', 'BDT 70,000 - 90,000', '2025-12-20T23:59:59.000Z', true, false, NOW(), NOW()),
('job-006', 'Female Security Guard', 'Female security guards needed for women-only facilities, hospitals, and educational institutions.', ARRAY['Female candidates only', 'Age 21-35 years', 'Good communication skills', 'Professional appearance', 'Any educational background', 'Security training provided'], 'Dhaka, Various Locations', 'full-time', 'BDT 20,000 - 28,000', '2026-01-31T23:59:59.000Z', true, false, NOW(), NOW());

-- ============================================
-- EMPLOYEES
-- ============================================
INSERT INTO "Employee" ("id", "employeeId", "firstName", "lastName", "email", "phone", "dateOfBirth", "gender", "address", "city", "state", "zipCode", "country", "position", "department", "employmentType", "joinDate", "salary", "status", "photo", "resume", "idCard", "certifications", "emergencyContactName", "emergencyContactPhone", "emergencyContactRelation", "skills", "notes", "active", "createdAt", "updatedAt") VALUES
('emp-001', 'EMP-001', 'Md. Kamal', 'Hossain', 'kamal.hossain@falconsecurity.com', '+880-1712-345678', '1985-03-15', 'Male', 'House 45, Road 12, Dhanmondi', 'Dhaka', 'Dhaka Division', '1209', 'Bangladesh', 'Security Manager', 'Operations', 'full-time', '2020-01-10', 85000, 'active', NULL, NULL, NULL, ARRAY['Security Management Certificate', 'First Aid Certified', 'Fire Safety Training'], 'Mrs. Ayesha Hossain', '+880-1812-345678', 'Spouse', ARRAY['Team Leadership', 'Risk Assessment', 'Crisis Management', 'Report Writing'], 'Senior manager with 15 years experience', true, NOW(), NOW()),

('emp-002', 'EMP-002', 'Abdul', 'Rahman', 'abdul.rahman@falconsecurity.com', '+880-1723-456789', '1988-07-22', 'Male', 'Flat 3B, Mirpur DOHS', 'Dhaka', 'Dhaka Division', '1216', 'Bangladesh', 'Security Supervisor', 'Field Operations', 'full-time', '2021-03-15', 48000, 'active', NULL, NULL, NULL, ARRAY['Security License', 'Supervisory Training'], 'Mr. Hafiz Rahman', '+880-1923-456789', 'Father', ARRAY['Team Management', 'Patrol Coordination', 'Incident Response'], 'Supervises 20 guards at corporate site', true, NOW(), NOW()),

('emp-003', 'EMP-003', 'Sharmin', 'Akter', 'sharmin.akter@falconsecurity.com', '+880-1634-567890', '1992-11-08', 'Female', 'House 78, Uttara Sector 7', 'Dhaka', 'Dhaka Division', '1230', 'Bangladesh', 'CCTV Operator', 'Monitoring', 'full-time', '2022-06-01', 26000, 'active', NULL, NULL, NULL, ARRAY['CCTV Operation Training'], 'Mrs. Fatema Begum', '+880-1734-567890', 'Mother', ARRAY['CCTV Monitoring', 'Incident Reporting', 'Computer Skills'], 'Works night shift - excellent performance', true, NOW(), NOW()),

('emp-004', 'EMP-004', 'Rahim', 'Uddin', 'rahim.uddin@falconsecurity.com', '+880-1845-678901', '1990-05-18', 'Male', 'Mohammadpur, Block A', 'Dhaka', 'Dhaka Division', '1207', 'Bangladesh', 'Armed Security Guard', 'Armed Division', 'full-time', '2021-09-20', 32000, 'active', NULL, NULL, NULL, ARRAY['Firearms License', 'Armed Security Training', 'First Aid'], 'Mr. Karim Uddin', '+880-1945-678901', 'Brother', ARRAY['Armed Security', 'VIP Protection', 'Emergency Response'], 'Assigned to high-security corporate client', true, NOW(), NOW()),

('emp-005', 'EMP-005', 'Nasima', 'Khatun', 'nasima.khatun@falconsecurity.com', '+880-1556-789012', '1994-09-25', 'Female', 'Gulshan 2, Road 45', 'Dhaka', 'Dhaka Division', '1212', 'Bangladesh', 'Security Guard', 'Female Unit', 'full-time', '2023-02-10', 24000, 'active', NULL, NULL, NULL, ARRAY['Security Training'], 'Mr. Sultan Ahmed', '+880-1656-789012', 'Father', ARRAY['Access Control', 'Customer Service', 'Patrol'], 'Stationed at ladies hospital', true, NOW(), NOW()),

('emp-006', 'EMP-006', 'Jahangir', 'Alam', 'jahangir.alam@falconsecurity.com', '+880-1767-890123', '1987-12-30', 'Male', 'Banani, Road 11', 'Dhaka', 'Dhaka Division', '1213', 'Bangladesh', 'Security Guard', 'Unarmed Division', 'full-time', '2020-08-15', 22000, 'active', NULL, NULL, NULL, ARRAY['Security License'], 'Mrs. Razia Begum', '+880-1867-890123', 'Spouse', ARRAY['Gate Security', 'Visitor Management', 'Patrol'], 'Reliable and punctual', true, NOW(), NOW()),

('emp-007', 'EMP-007', 'Tahmina', 'Yasmin', 'tahmina.yasmin@falconsecurity.com', NULL, '1991-04-12', 'Female', 'Motijheel', 'Dhaka', 'Dhaka Division', '1000', 'Bangladesh', 'HR Officer', 'Administration', 'full-time', '2022-01-05', 38000, 'active', NULL, NULL, NULL, ARRAY['HR Management Certificate'], 'Mr. Yasmin Ahmed', '+880-1978-901234', 'Father', ARRAY['Recruitment', 'Training Coordination', 'Payroll'], 'Handles all HR operations', true, NOW(), NOW()),

('emp-008', 'EMP-008', 'Monir', 'Hossain', 'monir.hossain@falconsecurity.com', '+880-1689-012345', '1989-08-20', 'Male', 'Badda, Link Road', 'Dhaka', 'Dhaka Division', '1212', 'Bangladesh', 'Security Guard', 'Mobile Patrol', 'full-time', '2021-11-22', 23000, 'on-leave', NULL, NULL, NULL, ARRAY['Driving License', 'Security Training'], 'Mr. Hafiz Monir', '+880-1789-012345', 'Father', ARRAY['Mobile Patrol', 'Driving', 'Site Inspection'], 'On medical leave - returns next month', true, NOW(), NOW());

-- ============================================
-- CLIENTS
-- ============================================
INSERT INTO "Client" ("id", "name", "logo", "website", "active", "featured", "createdAt", "updatedAt") VALUES
('cli-001', 'Bashundhara Group', NULL, 'https://bashundharagroup.com', true, true, NOW(), NOW()),
('cli-002', 'BRAC Bank Limited', NULL, 'https://bracbank.com', true, true, NOW(), NOW()),
('cli-003', 'Dhaka Bank', NULL, 'https://dhaka-bank.com', true, false, NOW(), NOW()),
('cli-004', 'Square Pharmaceuticals', NULL, 'https://squarepharma.com.bd', true, true, NOW(), NOW()),
('cli-005', 'Jamuna Future Park', NULL, 'https://jamunafuturepark.com', true, false, NOW(), NOW()),
('cli-006', 'United Hospital', NULL, 'https://uhlbd.com', true, false, NOW(), NOW()),
('cli-007', 'North South University', NULL, 'https://northsouth.edu', true, false, NOW(), NOW()),
('cli-008', 'Radisson Blu Hotel', NULL, 'https://radissonhotels.com', true, false, NOW(), NOW());

-- ============================================
-- BLOG POSTS
-- ============================================
INSERT INTO "Blog" ("id", "title", "content", "excerpt", "author", "image", "published", "featured", "views", "createdAt", "updatedAt") VALUES
('blog-001', 'Top 10 Security Tips for Businesses in Bangladesh', 'Security is paramount for any business. Here are our top 10 tips: 1) Install CCTV cameras at all entry points... 2) Hire professional security guards... 3) Implement access control systems... 4) Conduct regular security audits... 5) Train employees on security protocols... 6) Use alarm systems... 7) Maintain proper lighting... 8) Secure perimeter fencing... 9) Background check all employees... 10) Have an emergency response plan.', 'Essential security measures every business owner in Bangladesh should implement to protect their assets and employees.', 'Falcon Security Team', NULL, true, true, 1245, NOW(), NOW()),

('blog-002', 'The Importance of Armed vs Unarmed Security Guards', 'Choosing between armed and unarmed security depends on your specific needs. Armed guards are ideal for high-risk environments like banks, jewelry stores, and VIP protection. Unarmed guards work well for residential areas, retail stores, and corporate offices. Consider threat level, legal requirements, insurance costs, and client comfort when making your decision.', 'Understanding when to use armed versus unarmed security personnel for optimal protection.', 'Md. Kamal Hossain', NULL, true, false, 856, NOW(), NOW()),

('blog-003', 'CCTV Installation Guide: What You Need to Know', 'Modern CCTV systems are essential for comprehensive security. Key considerations include: camera resolution (minimum 1080p recommended), storage capacity (30-90 days retention), night vision capability, weatherproof housing for outdoor cameras, remote access features, and professional installation. Falcon Security provides complete CCTV solutions with 24/7 monitoring services.', 'A comprehensive guide to choosing and installing CCTV surveillance systems for your property.', 'Falcon Security Team', NULL, true, true, 2103, NOW(), NOW()),

('blog-004', 'Event Security Planning: A Complete Checklist', 'Planning security for events requires careful preparation. Our checklist includes: venue assessment, crowd size estimation, entry/exit points identification, VIP protection planning, emergency evacuation routes, medical facility coordination, communication systems, and post-event debriefing. Falcon Security has successfully managed 500+ events across Bangladesh.', 'Essential steps for planning and executing successful event security operations.', 'Abdul Rahman', NULL, true, false, 432, NOW(), NOW());

-- ============================================
-- BANNERS
-- ============================================
INSERT INTO "Banner" ("id", "title", "subtitle", "description", "buttonText", "buttonLink", "image", "active", "order", "createdAt", "updatedAt") VALUES
('ban-001', 'Your Safety, Our Priority', 'Professional Security Services in Bangladesh', 'Falcon Security Limited provides comprehensive security solutions including armed guards, CCTV surveillance, and event security across Bangladesh.', 'Get a Quote', '/contact', NULL, true, 1, NOW(), NOW()),
('ban-002', '24/7 Security Protection', 'Trusted by 500+ Clients Nationwide', 'From corporate offices to residential complexes, we deliver reliable security services with trained professionals and modern technology.', 'Our Services', '/services', NULL, true, 2, NOW(), NOW()),
('ban-003', 'Expert Security Solutions', '15+ Years of Excellence', 'ISO certified security company with highly trained guards, advanced CCTV systems, and rapid emergency response capabilities.', 'Contact Us', '/contact', NULL, true, 3, NOW(), NOW());

-- ============================================
-- CONTACT MESSAGES (Sample)
-- ============================================
INSERT INTO "Contact" ("id", "name", "email", "phone", "serviceType", "message", "read", "createdAt", "updatedAt") VALUES
('con-001', 'Rahman Trading Corporation', 'info@rahmantrading.com', '+880-1711-223344', 'Corporate Security', 'We need security services for our new warehouse in Gazipur. Please contact us for quotation.', false, NOW(), NOW()),
('con-002', 'Sara Ahmed', 'sara.ahmed@gmail.com', '+880-1822-334455', 'Residential Security', 'Looking for security guard services for our apartment building in Gulshan. 24/7 coverage needed.', false, NOW(), NOW()),
('con-003', 'Dhaka International School', 'admin@dis.edu.bd', '+880-1933-445566', 'Event Security', 'We are organizing our annual function on December 20th. Need security team for the event.', true, NOW(), NOW());

-- ============================================
-- SETTINGS
-- ============================================
INSERT INTO "Settings" ("id", "siteName", "siteDescription", "contactEmail", "contactPhone", "address", "facebook", "twitter", "linkedin", "instagram", "createdAt", "updatedAt") VALUES
('settings-001', 'Falcon Security Limited', 'Leading Security Service Provider in Bangladesh - Armed Guards, CCTV Surveillance, Event Security, Corporate Protection', 'info@falconsecurity.com.bd', '+880-2-9876543, +880-1711-111222', 'House 23, Road 7, Sector 4, Uttara, Dhaka-1230, Bangladesh', 'https://facebook.com/falconsecuritybd', 'https://twitter.com/falconsecbd', 'https://linkedin.com/company/falcon-security-bd', 'https://instagram.com/falconsecuritybd', NOW(), NOW());

-- Note: This data is realistic and tailored for Falcon Security Limited
-- Adjust IDs, dates, and details as needed for your specific requirements
