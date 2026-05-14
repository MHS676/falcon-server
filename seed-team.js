const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const teamMembers = [
  { employeeId: 'TM-001', firstName: 'Mrs. Mayeeda', lastName: 'Choudhury', position: 'Chairperson', department: 'Leadership', notes: '' },
  { employeeId: 'TM-002', firstName: 'Major Zulfiqar H.', lastName: 'Choudhury (Retd)', position: 'Managing Director', department: 'Leadership', notes: '' },
  { employeeId: 'TM-003', firstName: 'Major Md. Nazmul', lastName: 'Haque (Retd)', position: 'Executive Director', department: 'Leadership', notes: 'MBA, PGDHRM' },
  { employeeId: 'TM-004', firstName: 'Major Kazi', lastName: 'Ashfaq (Retd)', position: 'Director Marketing', department: 'Management', notes: '' },
  { employeeId: 'TM-005', firstName: 'Mohammad Ali Yusuf', lastName: 'Hossain', position: 'Director Finance & Digital Surveillance', department: 'Management', notes: 'MCom, MBA, DCS, CSP' },
  { employeeId: 'TM-006', firstName: 'Lt. Mizanur', lastName: 'Rahman BN (Retd)', position: 'General Manager (Admin & Ops)', department: 'Management', notes: 'ISO 9001:2015 Lead Auditor' },
  { employeeId: 'TM-007', firstName: 'Md. Mostafizur', lastName: 'Rahman', position: 'Deputy General Manager (Operations)', department: 'Management', notes: '' },
  { employeeId: 'TM-008', firstName: 'Md. Jalal', lastName: 'Ahmed', position: 'Manager Chittagong Region', department: 'Management', notes: '' },
  { employeeId: 'TM-009', firstName: 'Engr. Sumon', lastName: 'Parvez', position: 'Manager Digital Surveillance Solutions', department: 'Management', notes: 'BSc (EEE)' },
  { employeeId: 'TM-010', firstName: 'Advocate Syed Mehedi', lastName: 'Hasan', position: 'Advisor Legal Affairs', department: 'Advisory', notes: '' },
  { employeeId: 'TM-011', firstName: 'DK', lastName: 'Associates', position: 'Advisor Corporate Affairs', department: 'Advisory', notes: '' },
];

async function main() {
  console.log('Seeding team members...');
  for (const m of teamMembers) {
    const email = `${m.employeeId.toLowerCase()}@falconslimited.com`;
    await prisma.employee.upsert({
      where: { employeeId: m.employeeId },
      update: {
        firstName: m.firstName,
        lastName: m.lastName,
        position: m.position,
        department: m.department,
        notes: m.notes || null,
        active: true,
        status: 'active',
      },
      create: {
        employeeId: m.employeeId,
        firstName: m.firstName,
        lastName: m.lastName,
        email,
        position: m.position,
        department: m.department,
        notes: m.notes || null,
        country: 'Bangladesh',
        employmentType: 'full-time',
        joinDate: new Date('2000-01-01'),
        status: 'active',
        active: true,
      },
    });
    console.log(`  ✓ ${m.firstName} ${m.lastName}`);
  }
  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
