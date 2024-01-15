
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import productController from '../controllers/Products.js'; 

async function productRouter(fastify: FastifyInstance, options: FastifyPluginOptions) {
  // Create product
  fastify.post('/products', productController.createProduct);

  // View all products
  fastify.get('/products', productController.getAllProducts);

  // View a specific product
  fastify.get('/products/:id', productController.getProduct);

  // Update product
  fastify.put('/products/:id', productController.updateProduct);

  // Delete product
  fastify.delete('/products/:id', productController.deleteProduct);
}

export default productRouter;
