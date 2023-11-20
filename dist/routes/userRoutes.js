"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
const userRoutes = (fastify, _, done) => {
    // Get all users
    // fastify.get('/users', async (req: FastifyRequest, reply: FastifyReply) => {
    //     await getUsers(req as CustomRequest, reply);
    // });
    fastify.get('/users', async (req, reply) => {
        reply.send({ message: 'Hello from /users' });
    });
    // Get a specific user by ID
    fastify.get('/users/:id', async (req, reply) => {
        await (0, userController_1.getUser)(req, reply);
    });
    // Create a new user
    fastify.post('/users', async (req, reply) => {
        await (0, userController_1.createUser)(req, reply);
    });
    // Update a user by ID
    fastify.put('/users/:id', async (req, reply) => {
        await (0, userController_1.updateUser)(req, reply);
    });
    // Delete a user by ID
    fastify.delete('/users/:id', async (req, reply) => {
        await (0, userController_1.deleteUser)(req, reply);
    });
    done();
};
exports.default = userRoutes;
