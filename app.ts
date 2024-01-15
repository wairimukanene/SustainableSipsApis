// src/app.ts
import fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import { PrismaClient } from '@prisma/client';
import userRouter from './src/routes/Users.js';

const app = fastify();





app.register(fastifyPostgres, {
  connectionString: process.env.DATABASE_URL, 
});

app.decorate('prisma', new PrismaClient());


app.register(userRouter);

const start = async () => {
  try {
    await app.listen({port:3000});

    const address = app.server.address();

    if (typeof address === 'string') {
      app.log.info(`Server listening on ${address}`);
    } else if (address && typeof address === 'object' && 'port' in address) {
      app.log.info(`Server listening on ${address.port}`);
    } else {
      app.log.info('Server started');
    }

  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();


