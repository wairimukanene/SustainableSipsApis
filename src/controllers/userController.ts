import { RouteGenericInterface, FastifyRequest, FastifyReply, RawServerDefault } from 'fastify';
import { User } from '../models/User';
import { MySQLConnection, MySQLPool, MySQLPromiseConnection, MySQLPromisePool } from '@fastify/mysql';
import { IncomingMessage } from 'http';
import { RowDataPacket, FieldPacket } from 'mysql2';


// Define an interface for your route parameters
interface RouteParams extends RouteGenericInterface {

    id: string;

}

// Define an interface for your request body
interface RequestBody {
    body: User;
}


// Extend the FastifyRequest interface to include the mysql property and the body property
export interface CustomRequest extends FastifyRequest<{ Params: RouteParams, Body: RequestBody }, RawServerDefault, IncomingMessage> {
    mysql: MySQLPromisePool;
    body: RequestBody;
}

export const getUsers = async (req: CustomRequest, reply: FastifyReply) => {
    try {
        // Use the query method directly on the pool
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await req.mysql.query('SELECT * FROM users');

        // Convert RowDataPacket objects to User objects
        const users: User[] = JSON.parse(JSON.stringify(rows));

        // Send the users data in the response
        reply.send(users);
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};


export const getUser = async (req: CustomRequest, reply: FastifyReply) => {
    try {
        // Get the user ID from the request parameters
        const id = req.params.id;

        // Use the query method directly on the pool
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await req.mysql.query(`SELECT * FROM users WHERE UserId = ?`, [id]);

        // Convert RowDataPacket objects to User objects
        const user: User = JSON.parse(JSON.stringify(rows[0]));

        // Check if the user exists
        if (!user) {
            reply.status(404).send({ error: 'User Not Found' });
            return;
        }

        // Send the user data in the response
        reply.send(user);
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};


export const createUser = async (req: CustomRequest, reply: FastifyReply) => {
    try {
        // Get the user data from the request body
        const userData: User = req.body.body;
        // Use the query method directly on the pool
        const [result]: any = await req.mysql.query('INSERT INTO users SET ?', userData);

        // Check if the user was created
        if (!result.affectedRows) {
            reply.status(500).send({ error: 'Internal Server Error', message: 'Failed to create user' });
            return;
        }

        // Get the ID of the created user
        const id = result.insertId;

        // Query the database for the created user
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await req.mysql.query(`SELECT * FROM users WHERE id = ?`, [id]);

        // Convert RowDataPacket objects to User objects
        const user: User = JSON.parse(JSON.stringify(rows[0]));

        // Send the created user data in the response
        reply.send(user);
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};


export const updateUser = async (req: CustomRequest, reply: FastifyReply) => {
    try {
        // Get the user ID from the request parameters
        const id = req.params.id;

        // Get the new user data from the request body
        const newUserData: User = req.body.body;

        // Use the query method directly on the pool
        const [result]: any = await req.mysql.query('UPDATE users SET ? WHERE id = ?', [newUserData, id]);

        // Check if the user was updated
        if (!result.affectedRows) {
            reply.status(404).send({ error: 'User Not Found' });
            return;
        }

        // Query the database for the updated user
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await req.mysql.query(`SELECT * FROM users WHERE id = ?`, [id]);

        // Convert RowDataPacket objects to User objects
        const user: User = JSON.parse(JSON.stringify(rows[0]));

        // Send the updated user data in the response
        reply.send(user);
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};


export const deleteUser = async (req: CustomRequest, reply: FastifyReply) => {
    try {
        // Get the user ID from the request parameters
        const id = req.params.id;

        // Use the query method directly on the pool
        const [result]: any = await req.mysql.query('DELETE FROM users WHERE id = ?', [id]);

        // Check if the user was deleted
        if (!result.affectedRows) {
            reply.status(404).send({ error: 'User Not Found' });
            return;
        }

        // Send a success message in the response
        reply.send({ message: 'User deleted successfully' });
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};

