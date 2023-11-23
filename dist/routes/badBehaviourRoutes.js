"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const badBehaviourController_1 = require("../controllers/badBehaviourController");
const badBehaviorRoutes = (fastify, _, done) => {
    // Get all bad behaviors
    fastify.get('/badbehaviors', async (req, reply) => {
        await (0, badBehaviourController_1.getBadBehaviors)(fastify, req, reply);
    });
    // Get a specific bad behavior by ID
    fastify.get('/badbehaviors/:BadBehaviorID', async (req, reply) => {
        await (0, badBehaviourController_1.getBadBehavior)(fastify, req, reply);
    });
    // Create a new bad behavior
    fastify.post('/badbehaviors', async (req, reply) => {
        await (0, badBehaviourController_1.createBadBehavior)(fastify, req, reply);
    });
    // Update a bad behavior by ID
    fastify.put('/badbehaviors/:BadBehaviorID', async (req, reply) => {
        await (0, badBehaviourController_1.updateBadBehavior)(fastify, req, reply);
    });
    // Delete a bad behavior by ID
    fastify.delete('/badbehaviors/:BadBehaviorID', async (req, reply) => {
        await (0, badBehaviourController_1.deleteBadBehavior)(fastify, req, reply);
    });
    done();
};
exports.default = badBehaviorRoutes;
