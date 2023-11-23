import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyMySQL from '@fastify/mysql';
import userRoutes from './routes/userRoutes'

const app = fastify({ logger: true });

app.register(fastifyCors);
app.register(fastifyMySQL, {
    promise: true,
    connectionString: 'mysql://root:pass@localhost:3306/rehabitualapp',
});

// Register routes
app.register(userRoutes);


console.log(app.printRoutes());

const start = async () => {
    try {
        await app.listen({ port: 3000 });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
