import { PrismaClient } from "@prisma/client";
import fonts from "../../../styles/fonts";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const rawData =
    await prisma.$queryRaw`SELECT * FROM wndttt ORDER BY RANDOM() LIMIT 1;`;

  const paragraphed = rawData[0].wndttt.split(/\r?\n/);
  const shuffledFonts = fonts.sort(() => 0.5 - Math.random());

  let selectedFonts = shuffledFonts.slice(0, paragraphed.length);

  const obj = paragraphed.map((value, index) => ({
    p: value,
    font: selectedFonts[index],
    size:
      Math.round((10 / (value ? value.length : 1) + 1.8) * 100) / 100 + "rem",
  }));

  res.status(200).json(obj);
}
