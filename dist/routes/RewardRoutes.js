"use strict";
// goodBehaviourRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const rewardController_1 = require("../controllers/rewardController"); // Assuming you have a reward controller
const rewardRoutes = (fastify, _, done) => {
    // Get all rewards
    fastify.get('/rewards', async (req, reply) => {
        await (0, rewardController_1.getRewards)(fastify, req, reply);
    });
    // Get a specific reward by ID
    fastify.get('/rewards/:RewardID', async (req, reply) => {
        await (0, rewardController_1.getReward)(fastify, req, reply);
    });
    // Create a new reward
    fastify.post('/rewards', async (req, reply) => {
        await (0, rewardController_1.createReward)(fastify, req, reply);
    });
    // Update a reward by ID
    fastify.put('/rewards/:RewardID', async (req, reply) => {
        await (0, rewardController_1.updateReward)(fastify, req, reply);
    });
    // Delete a reward by ID
    fastify.delete('/rewards/:RewardID', async (req, reply) => {
        await (0, rewardController_1.deleteReward)(fastify, req, reply);
    });
    // Award a reward to the user with the most positive points
    fastify.post('/award-reward', async (req, reply) => {
        await (0, rewardController_1.awardReward)(fastify, req, reply);
    });
    done();
};
exports.default = rewardRoutes;
