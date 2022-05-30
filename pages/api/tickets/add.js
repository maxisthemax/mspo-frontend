import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const postData = req.body;

      await prisma.tickets.create({
        data: {
          ...postData,
          firstWeight: parseFloat(postData.firstWeight) || 0,
          secondWeight: parseFloat(postData.secondWeight) || 0,
          deduction: parseFloat(postData.deduction) || 0,
          priceMt: parseFloat(postData.priceMt) || 0,
          oer: parseFloat(postData.oer) || 0,
          custId: parseFloat(postData.custId) || 0,
          buyerId: parseFloat(postData.buyerId) || 0,
          landId: parseFloat(postData.landId) || 0,
        },
      });

      res.status(200).end();
    } catch (err) {
      res.status(err).json({});
    }
  } else {
    res.status(405);
    res.end();
  }
}
