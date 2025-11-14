import { hashPassword } from "@/lib/password.utils";
import { PrismaClient, Role } from "@prisma/client";
import { seedBookkeepingData } from "./seed/bookkeeping.seed";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@testmail.com",
      password: await hashPassword("adminpass123"),
      role: Role.ADMIN,
    },
  });
  if (process.env.NODE_ENV !== "production") {
    await seedBookkeepingData(prisma);
  }
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
