import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UserModel {
  createUser(name: string, email: string, contact: string, roleId: number): Promise<any>;
  getAllUsers(): Promise<any[]>;
  getUserById(id: number): Promise<any>;
  updateUser(id: number, name: string, email: string, contact: string, roleId: number): Promise<any>;
  deleteUser(id: number): Promise<any>;
}

const userModel: UserModel = {
  async createUser(name, email, contact, roleId) {
    const result = await prisma.user.create({
      data: {
        name,
        email,
        contact,
        roleId,
      },
    });
    return result;
  },

  async getAllUsers() {
    const result = await prisma.user.findMany();
    return result;
  },

  async getUserById(id) {
    const result = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return result;
  },

  async updateUser(id, name, email, contact, roleId) {
    const result = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        contact,
        roleId,
      },
    });
    return result;
  },

  async deleteUser(id) {
    const result = await prisma.user.delete({
      where: {
        id,
      },
    });
    return result;
  },
};

export default userModel;
