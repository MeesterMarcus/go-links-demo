import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const links = [
  { slug: "design-system", destination: "https://ui.shadcn.com", description: "Components, tokens, and product UI guidance", visits: 128 },
  { slug: "oncall", destination: "https://status.example.com/on-call", description: "Current on-call rotation and escalation guide", visits: 86 },
  { slug: "payroll", destination: "https://people.example.com/payroll", description: "Pay statements, tax forms, and direct deposit", visits: 43 },
];

async function main() {
  for (const link of links) {
    await prisma.link.upsert({ where: { slug: link.slug }, update: {}, create: link });
  }
}

main().then(() => prisma.$disconnect()).catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
