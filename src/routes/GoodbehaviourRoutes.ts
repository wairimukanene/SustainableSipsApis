import { FastifyPluginCallback, FastifyRequest, FastifyReply } from 'fastify';
import { getGoodBehavior, getGoodBehaviors, createGoodBehavior, updateGoodBehavior, deleteGoodBehavior } from '../controllers/goodBehaviourController';
import { CustomRequest } from '../controllers/goodBehaviourController';

const goodBehaviorRoutes: FastifyPluginCallback = (fastify, _, done) => {
    // Get all good behaviors
    fastify.get('/goodbehaviors', async (req: FastifyRequest, reply: FastifyReply) => {
        await getGoodBehaviors(fastify, req as CustomRequest, reply);
    });

    // Get a specific good behavior by ID
    fastify.get('/goodbehaviors/:GoodBehaviorID', async (req: FastifyRequest, reply: FastifyReply) => {
        await getGoodBehavior(fastify, req as CustomRequest, reply);
    });

    // Create a new good behavior
    fastify.post('/goodbehaviors', async (req: FastifyRequest, reply: FastifyReply) => {
        await createGoodBehavior(fastify, req as CustomRequest, reply);
    });

    // Update a good behavior by ID
    fastify.put('/goodbehaviors/:GoodBehaviorID', async (req: FastifyRequest, reply: FastifyReply) => {
        await updateGoodBehavior(fastify, req as CustomRequest, reply);
    });

    // Delete a good behavior by ID
    fastify.delete('/goodbehaviors/:GoodBehaviorID', async (req: FastifyRequest, reply: FastifyReply) => {
        await deleteGoodBehavior(fastify, req as CustomRequest, reply);
    });

    done();
};

export default goodBehaviorRoutes;
