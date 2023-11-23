import { FastifyPluginCallback, FastifyRequest, FastifyReply } from 'fastify';
import { getBadBehavior, getBadBehaviors, createBadBehavior, updateBadBehavior, deleteBadBehavior } from '../controllers/badBehaviourController';
import { CustomRequest } from '../controllers/badBehaviourController';

const badBehaviorRoutes: FastifyPluginCallback = (fastify, _, done) => {
    // Get all bad behaviors
    fastify.get('/badbehaviors', async (req: FastifyRequest, reply: FastifyReply) => {
        await getBadBehaviors(fastify, req as CustomRequest, reply);
    });

    // Get a specific bad behavior by ID
    fastify.get('/badbehaviors/:BadBehaviorID', async (req: FastifyRequest, reply: FastifyReply) => {
        await getBadBehavior(fastify, req as CustomRequest, reply);
    });

    // Create a new bad behavior
    fastify.post('/badbehaviors', async (req: FastifyRequest, reply: FastifyReply) => {
        await createBadBehavior(fastify, req as CustomRequest, reply);
    });

    // Update a bad behavior by ID
    fastify.put('/badbehaviors/:BadBehaviorID', async (req: FastifyRequest, reply: FastifyReply) => {
        await updateBadBehavior(fastify, req as CustomRequest, reply);
    });

    // Delete a bad behavior by ID
    fastify.delete('/badbehaviors/:BadBehaviorID', async (req: FastifyRequest, reply: FastifyReply) => {
        await deleteBadBehavior(fastify, req as CustomRequest, reply);
    });

    done();
};

export default badBehaviorRoutes;
