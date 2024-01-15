// src/app.ts
import fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import { PrismaClient } from '@prisma/client';
import userRouter from './src/routes/Users.js';
import saleRouter from './src/routes/Sales.js';

const app = fastify();





app.register(fastifyPostgres, {
  connectionString: process.env.DATABASE_URL,
});

app.decorate('prisma', new PrismaClient());


app.register(userRouter);
app.register(saleRouter);

const start = async () => {
  try {
    const address = await app.listen(3000);
    app.log.info(`Server listening on ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();


