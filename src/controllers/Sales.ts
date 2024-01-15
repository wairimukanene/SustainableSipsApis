// src/controllers/saleController.ts
import { RouteGenericInterface, FastifyRequest, FastifyReply } from 'fastify';
import saleModel from '../models/Sales.js'; // Assuming your Sale model file is named Sale.js

interface RouteParams extends RouteGenericInterface {
    Params: {
        id: number;
    };
}

async function createSale(request: FastifyRequest, reply: FastifyReply) {
    const { saleAmount, productId } = request.body as Record<string, unknown>;
    const newSale = await saleModel.createSale(saleAmount as number, productId as number);
    reply.send(newSale);
}

async function getAllSales(request: FastifyRequest, reply: FastifyReply) {
    const sales = await saleModel.getAllSales();
    reply.send(sales);
}

async function getSale(request: FastifyRequest<RouteParams>, reply: FastifyReply) {
    const id = request.params.id;
    const sale = await saleModel.getSaleById(id);
    reply.send(sale);
}

async function updateSale(request: FastifyRequest<RouteParams>, reply: FastifyReply) {
    const id = request.params.id;
    const { saleAmount, productId } = request.body as Record<string, unknown>;
    const updatedSale = await saleModel.updateSale(id, saleAmount as number, productId as number);
    reply.send(updatedSale);
}

async function deleteSale(request: FastifyRequest<RouteParams>, reply: FastifyReply) {
    const id = request.params.id;
    const deletedSale = await saleModel.deleteSale(id);
    reply.send(deletedSale);
}

export default {
    createSale,
    getAllSales,
    getSale,
    updateSale,
    deleteSale,
};
