// src/routers/userRouter.ts
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import userController from '../controllers/Users.js';

async function userRouter(fastify: FastifyInstance, options: FastifyPluginOptions) {
  // Create user
  fastify.post('/users', userController.createUser);

  // View all users
  fastify.get('/users', userController.getAllUsers);

  // View a specific user
  fastify.get('/users/:guid', userController.getUser);

  // Update user
  fastify.put('/users/:guid', userController.updateUser);

  // Delete user
  fastify.delete('/users/:guid', userController.deleteUser);
}

export default userRouter;
