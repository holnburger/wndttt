import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const posts =
    await prisma.$queryRaw`SELECT * FROM wndttt ORDER BY RANDOM() LIMIT 1;`;
  res.status(200).json(posts);
}
