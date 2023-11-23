import { FastifyPluginCallback, FastifyRequest, FastifyReply } from 'fastify';
import { getUser, getUsers, createUser, updateUser, deleteUser } from '../controllers/userController';
import { CustomRequest } from '../controllers/userController';

const userRoutes: FastifyPluginCallback = (fastify, _, done) => {
    // Get all users
    fastify.get('/users', async (req: FastifyRequest, reply: FastifyReply) => {
        await getUsers(fastify, req as CustomRequest, reply);
    });


    // Get a specific user by ID
    fastify.get('/users/:UserId', async (req: FastifyRequest, reply: FastifyReply) => {
        await getUser(fastify, req as CustomRequest, reply);
    });

    // Create a new user
    fastify.post('/users', async (req: FastifyRequest, reply: FastifyReply) => {
        await createUser(fastify, req as CustomRequest, reply);
    });

    // Update a user by ID
    fastify.put('/users/:UserId', async (req: FastifyRequest, reply: FastifyReply) => {
        await updateUser(fastify, req as CustomRequest, reply);
    });

    // Delete a user by ID
    fastify.delete('/users/:UserId', async (req: FastifyRequest, reply: FastifyReply) => {
        await deleteUser(fastify, req as CustomRequest, reply);
    });



    done();
};

export default userRoutes;
