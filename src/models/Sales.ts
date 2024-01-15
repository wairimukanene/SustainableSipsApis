import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SaleModel {
  createSale(saleAmount: number, productId: number): Promise<any>;
  getAllSales(): Promise<any[]>;
  getSaleById(id: number): Promise<any>;
  updateSale(id: number, saleAmount: number, productId: number): Promise<any>;
  deleteSale(id: number): Promise<any>;
}

const saleModel: SaleModel = {
  async createSale(saleAmount, productId) {
    const result = await prisma.sale.create({
      data: {
        saleAmount,
        productId,
      },
    });
    return result;
  },

  async getAllSales() {
    const result = await prisma.sale.findMany();
    return result;
  },

  async getSaleById(id) {
    const result = await prisma.sale.findUnique({
      where: {
        id,
      },
    });
    return result;
  },

  async updateSale(id, saleAmount, productId) {
    const result = await prisma.sale.update({
      where: {
        id,
      },
      data: {
        saleAmount,
        productId,
      },
    });
    return result;
  },

  async deleteSale(id) {
    const result = await prisma.sale.delete({
      where: {
        id,
      },
    });
    return result;
  },
};

export default saleModel;
