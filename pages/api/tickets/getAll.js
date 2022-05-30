import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const coId = req.query.coId;

  const data = await prisma.tickets.findMany({
    where: { AND: [coId ? { coId: parseInt(coId) } : {}] },
    include: { transporters: true },
    orderBy: { createdDate: "desc" },
  });
  res.json(data);
}
