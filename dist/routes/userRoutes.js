"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
const userRoutes = (fastify, _, done) => {
    // Get all users
    fastify.get('/users', async (req, reply) => {
        await (0, userController_1.getUsers)(fastify, req, reply);
    });
    // Get a specific user by ID
    fastify.get('/users/:UserId', async (req, reply) => {
        await (0, userController_1.getUser)(fastify, req, reply);
    });
    // Create a new user
    fastify.post('/users', async (req, reply) => {
        await (0, userController_1.createUser)(fastify, req, reply);
    });
    // Update a user by ID
    fastify.put('/users/:UserId', async (req, reply) => {
        await (0, userController_1.updateUser)(fastify, req, reply);
    });
    // Delete a user by ID
    fastify.delete('/users/:UserId', async (req, reply) => {
        await (0, userController_1.deleteUser)(fastify, req, reply);
    });
    done();
};
exports.default = userRoutes;
