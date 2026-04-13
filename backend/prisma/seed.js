const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding foundational data...');

  // Create Roles
  const roles = ['ADMIN', 'OPERATOR', 'CUSTOMER'];
  const roleMap = {};

  for (const roleName of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
    roleMap[roleName] = role.id;
    console.log(`Role created: ${roleName}`);
  }

  // Create Bootstrap Admin if not exists
  const adminEmail = 'admin@smarttransitke.com';
  const bootstrapAdmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'System Admin',
      email: adminEmail,
      passwordHash: await bcrypt.hash('Admin@2026!', 12),
      roleId: roleMap['ADMIN'],
    },
  });

  console.log(`Admin user seeded: ${adminEmail}`);
  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
