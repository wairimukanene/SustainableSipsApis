// goodBehaviourRoutes.ts

import { FastifyPluginCallback, FastifyRequest, FastifyReply } from 'fastify';
import { getReward, getRewards, createReward, updateReward, deleteReward, awardReward } from '../controllers/rewardController'; // Assuming you have a reward controller
import { CustomRequest } from '../controllers/rewardController';

const rewardRoutes: FastifyPluginCallback = (fastify, _, done) => {
    // Get all rewards
    fastify.get('/rewards', async (req: FastifyRequest, reply: FastifyReply) => {
        await getRewards(fastify, req as CustomRequest, reply);
    });

    // Get a specific reward by ID
    fastify.get('/rewards/:RewardID', async (req: FastifyRequest, reply: FastifyReply) => {
        await getReward(fastify, req as CustomRequest, reply);
    });

    // Create a new reward
    fastify.post('/rewards', async (req: FastifyRequest, reply: FastifyReply) => {
        await createReward(fastify, req as CustomRequest, reply);
    });

    // Update a reward by ID
    fastify.put('/rewards/:RewardID', async (req: FastifyRequest, reply: FastifyReply) => {
        await updateReward(fastify, req as CustomRequest, reply);
    });

    // Delete a reward by ID
    fastify.delete('/rewards/:RewardID', async (req: FastifyRequest, reply: FastifyReply) => {
        await deleteReward(fastify, req as CustomRequest, reply);
    });

    // Award a reward to the user with the most positive points
    fastify.post('/award-reward', async (req: FastifyRequest, reply: FastifyReply) => {
        await awardReward(fastify, req as CustomRequest, reply);
    });


    done();
};

export default rewardRoutes;
