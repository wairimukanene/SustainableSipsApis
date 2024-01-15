// src/routers/saleRouter.ts
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import saleController from '../controllers/Sales.js';

async function saleRouter(fastify: FastifyInstance, options: FastifyPluginOptions) {
    // Create sale
    fastify.post('/sales', saleController.createSale);

    // View all sales
    fastify.get('/sales', saleController.getAllSales);

    // View a specific sale
    fastify.get('/sales/:id', saleController.getSale);

    // Update sale
    fastify.put('/sales/:id', saleController.updateSale);

    // Delete sale
    fastify.delete('/sales/:id', saleController.deleteSale);
}

export default saleRouter;
