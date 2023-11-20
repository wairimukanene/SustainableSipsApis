"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const mysql_1 = __importDefault(require("@fastify/mysql"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
// import { userRoutes, badBehaviorRoutes, goodBehaviorRoutes, rewardRoutes, trackingRecordRoutes, notificationRoutes, activityRoutes } from './routes';
const app = (0, fastify_1.default)({ logger: true });
app.register(cors_1.default);
app.register(mysql_1.default, {
    promise: true,
    connectionString: 'mysql://root:pass@localhost:3306/rehabitualapp',
});
// Register routes
app.register(userRoutes_1.default, { prefix: '/users' });
// app.register(badBehaviorRoutes, { prefix: '/bad-behaviors' });
// app.register(goodBehaviorRoutes, { prefix: '/good-behaviors' });
// app.register(rewardRoutes, { prefix: '/rewards' });
// app.register(trackingRecordRoutes, { prefix: '/tracking-records' });
// app.register(notificationRoutes, { prefix: '/notifications' });
// app.register(activityRoutes, { prefix: '/activities' });
console.log(app.printRoutes());
const start = async () => {
    try {
        await app.listen({ port: 3000 });
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
