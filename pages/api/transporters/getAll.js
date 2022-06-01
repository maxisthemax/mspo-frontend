import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const coId = req.query.coId;

      const data = await prisma.transporters.findMany({
        where: { AND: [coId ? { coId: parseInt(coId) } : {}] },
        orderBy: { createdDate: "desc" },
      });
      res.json(data);
    } catch (err) {
      res.status(err).json({});
    }
  } else {
    res.status(405);
    res.end();
  }
}
