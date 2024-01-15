
import { RouteGenericInterface, FastifyRequest, FastifyReply } from 'fastify';
import userModel from '../models/Users.js';

interface RouteParams extends RouteGenericInterface {
    Params: {
        id: number;

    };
}

async function createUser(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, contact, roleId } = request.body as Record<string, unknown>;
    const newUser = await userModel.createUser(name as string, email as string, contact as string, roleId as number);
    reply.send(newUser);
}

async function getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    const users = await userModel.getAllUsers();
    reply.send(users);
}

async function getUser(request: FastifyRequest<RouteParams>, reply: FastifyReply) {
    const id = request.params.id;
    const user = await userModel.getUserById(id);
    reply.send(user);
}

async function updateUser(request: FastifyRequest<RouteParams>, reply: FastifyReply) {
    const id = request.params.id;
    const { name, email, contact, roleId } = request.body as Record<string, unknown>;
    const updatedUser = await userModel.updateUser(id, name as string, email as string, contact as string, roleId as number);
    reply.send(updatedUser);
}

async function deleteUser(request: FastifyRequest<RouteParams>, reply: FastifyReply) {
    const id = request.params.id;
    const deletedUser = await userModel.deleteUser(id);
    reply.send(deletedUser);
}

export default {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
};
