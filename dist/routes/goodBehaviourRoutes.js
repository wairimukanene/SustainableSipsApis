"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const goodBehaviourController_1 = require("../controllers/goodBehaviourController");
const goodBehaviorRoutes = (fastify, _, done) => {
    // Get all good behaviors
    fastify.get('/goodbehaviors', async (req, reply) => {
        await (0, goodBehaviourController_1.getGoodBehaviors)(fastify, req, reply);
    });
    // Get a specific good behavior by ID
    fastify.get('/goodbehaviors/:GoodBehaviorID', async (req, reply) => {
        await (0, goodBehaviourController_1.getGoodBehavior)(fastify, req, reply);
    });
    // Create a new good behavior
    fastify.post('/goodbehaviors', async (req, reply) => {
        await (0, goodBehaviourController_1.createGoodBehavior)(fastify, req, reply);
    });
    // Update a good behavior by ID
    fastify.put('/goodbehaviors/:GoodBehaviorID', async (req, reply) => {
        await (0, goodBehaviourController_1.updateGoodBehavior)(fastify, req, reply);
    });
    // Delete a good behavior by ID
    fastify.delete('/goodbehaviors/:GoodBehaviorID', async (req, reply) => {
        await (0, goodBehaviourController_1.deleteGoodBehavior)(fastify, req, reply);
    });
    done();
};
exports.default = goodBehaviorRoutes;
