
import { RouteGenericInterface, FastifyRequest, FastifyReply } from 'fastify';
import productModel from '../models/Products.js';

interface RouteParams extends RouteGenericInterface {
    Params: {
        id: number;
    };
}

async function createProduct(request: FastifyRequest, reply: FastifyReply) {
    const { image, name, quantity, buyingPrice, sellingPrice, description } = request.body as Record<string, unknown>;
    const newProduct = await productModel.createProduct(
        image as string,
        name as string,
        quantity as number,
        buyingPrice as number,
        sellingPrice as number,
        description as string
    );
    reply.send(newProduct);
}

async function getAllProducts(request: FastifyRequest, reply: FastifyReply) {
    const products = await productModel.getAllProducts();
    reply.send(products);
}

async function getProduct(request: FastifyRequest<RouteParams>, reply: FastifyReply) {
    const id = request.params.id;
    const product = await productModel.getProductById(id);
    reply.send(product);
}

async function updateProduct(request: FastifyRequest<RouteParams>, reply: FastifyReply) {
    const id = request.params.id;
    const { image, name, quantity, buyingPrice, sellingPrice, description } = request.body as Record<string, unknown>;
    const updatedProduct = await productModel.updateProduct(
        id,
        image as string,
        name as string,
        quantity as number,
        buyingPrice as number,
        sellingPrice as number,
        description as string
    );
    reply.send(updatedProduct);
}

async function deleteProduct(request: FastifyRequest<RouteParams>, reply: FastifyReply) {
    const id = request.params.id;
    const deletedProduct = await productModel.deleteProduct(id);
    reply.send(deletedProduct);
}

export default {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
};
