import { FastifyPluginCallback, FastifyRequest, FastifyReply } from 'fastify';
import { getUser, getUsers, createUser, updateUser, deleteUser } from '../controllers/userController';
import { CustomRequest } from '../controllers/userController';

const userRoutes: FastifyPluginCallback = (fastify, _, done) => {
    // Get all users
    fastify.get('/users', async (req: FastifyRequest, reply: FastifyReply) => {
        await getUsers(req as CustomRequest, reply);
    });
    // fastify.get('/users', async (req: FastifyRequest, reply: FastifyReply) => {
    //     reply.send({ message: 'Hello from /users' });
    // });


    // Get a specific user by ID
    fastify.get('/users/:id', async (req: FastifyRequest, reply: FastifyReply) => {
        await getUser(req as CustomRequest, reply);
    });

    // Create a new user
    fastify.post('/users', async (req: FastifyRequest, reply: FastifyReply) => {
        await createUser(req as CustomRequest, reply);
    });

    // Update a user by ID
    fastify.put('/users/:id', async (req: FastifyRequest, reply: FastifyReply) => {
        await updateUser(req as CustomRequest, reply);
    });

    // Delete a user by ID
    fastify.delete('/users/:id', async (req: FastifyRequest, reply: FastifyReply) => {
        await deleteUser(req as CustomRequest, reply);
    });

    done();
};

export default userRoutes;
