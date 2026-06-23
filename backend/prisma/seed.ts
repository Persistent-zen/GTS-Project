import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Bulk insert users
  const users = await prisma.user.createMany({
    data: [
      { name: "Alice", email: "alice@example.com" },
      { name: "Bob", email: "bob@example.com" },
      { name: "Charlie", email: "charlie@example.com" },
    ],
  });

  console.log(`Inserted ${users.count} users`);

  // Bulk insert scores for users
  const allUsers = await prisma.user.findMany();

  const scoresData = allUsers.flatMap(user =>
    Array.from({ length: 5 }).map(() => ({
      dr: Math.floor(Math.random() * 100),
      cf: Math.floor(Math.random() * 100),
      pi: Math.floor(Math.random() * 100),
      dh: Math.floor(Math.random() * 100),
      iv: Math.floor(Math.random() * 100),
      gts: 0, // will be calculated below
      userId: user.id,
    }))
  );

  for (const score of scoresData) {
    score.gts = Math.round(0.4 * score.dr + 0.3 * score.cf + 0.15 * score.pi + 0.1 * score.dh + 0.05 * score.iv);
  }

  await prisma.score.createMany({ data: scoresData });
  console.log(`Inserted ${scoresData.length} scores`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
