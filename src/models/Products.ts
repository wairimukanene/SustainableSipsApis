import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProductModel {
  createProduct(image: string, name: string, quantity: number, buyingPrice: number, sellingPrice: number, description: string): Promise<any>;
  getAllProducts(): Promise<any[]>;
  getProductById(id: number): Promise<any>;
  updateProduct(id: number, image: string, name: string, quantity: number, buyingPrice: number, sellingPrice: number, description: string): Promise<any>;
  deleteProduct(id: number): Promise<any>;
}

const productModel: ProductModel = {
  async createProduct(image, name, quantity, buyingPrice, sellingPrice, description) {
    const result = await prisma.product.create({
      data: {
        image,
        name,
        quantity,
        buyingPrice,
        sellingPrice,
        description,
      },
    });
    return result;
  },

  async getAllProducts() {
    const result = await prisma.product.findMany();
    return result;
  },

  async getProductById(id) {
    const result = await prisma.product.findUnique({
      where: {
        id,
      },
    });
    return result;
  },

  async updateProduct(id, image, name, quantity, buyingPrice, sellingPrice, description) {
    const result = await prisma.product.update({
      where: {
        id,
      },
      data: {
        image,
        name,
        quantity,
        buyingPrice,
        sellingPrice,
        description,
      },
    });
    return result;
  },

  async deleteProduct(id) {
    const result = await prisma.product.delete({
      where: {
        id,
      },
    });
    return result;
  },
};

export default productModel;
