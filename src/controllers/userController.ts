import { RouteGenericInterface, FastifyRequest, FastifyReply, RawServerDefault } from 'fastify';
import { User } from '../models/User';
import { MySQLConnection, MySQLPool, MySQLPromiseConnection, MySQLPromisePool } from '@fastify/mysql';
import { IncomingMessage } from 'http';
import { RowDataPacket, FieldPacket } from 'mysql2';


// Define an interface for your route parameters
interface RouteParams extends RouteGenericInterface {
    UserId: any;

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

export const getUsers = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        // Use the query method directly on the pool
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await fastify.mysql.query('SELECT * FROM users');

        // Convert RowDataPacket objects to User objects
        const users: User[] = JSON.parse(JSON.stringify(rows));

        // Send the users data in the response
        reply.send(users);
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};


export const getUser = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        // Get the user ID from the request parameters
        const id = req.params.id;

        // Use the query method directly on the pool
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await fastify.mysql.query(`SELECT * FROM users WHERE UserId = ?`, [id]);

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



export const createUser = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        // Get the user data from the request body
        console.log(req.body);
        const userData: any = req.body;

        // Use the query method directly on the pool
        const [result]: any = await fastify.mysql.query('INSERT INTO users ( Username, Email, Password) VALUES ( ?, ?, ?)', [userData.Username, userData.Email, userData.Password]);

        // Check if the user was created
        if (!result.affectedRows) {
            reply.status(500).send({ error: 'Internal Server Error', message: 'Failed to create user' });
            return;
        }

        // Get the ID of the created user
        const id = result.insertId;

        // Query the database for the created user
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await fastify.mysql.query(`SELECT * FROM users WHERE UserId = ?`, [id]);

        // Convert RowDataPacket objects to User objects
        const user: User = JSON.parse(JSON.stringify(rows[0]));

        // Send the created user data in the response
        reply.send(user);
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};


export const updateUser = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        // Get the user ID from the request parameters
        console.log(req.params);
        const UserID = req.params.UserId;

        const newUserData: any = req.body;

        const values = Object.values(newUserData);
        console.log(values);

        const [result]: any = await fastify.mysql.query('UPDATE users SET Username = ?, Email = ?, Password = ? WHERE UserId = ?', [newUserData.Username, newUserData.Email, newUserData.Password, UserID]);

        console.log(result);

        // Check if the user was updated
        if (!result.affectedRows) {
            reply.status(404).send({ error: 'User Not Found' });
            return;
        }

        // Query the database for the updated user
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await fastify.mysql.query(`SELECT * FROM users WHERE UserId = ?`, [UserID]);
        console.log(rows[0]);

        // Convert RowDataPacket objects to User objects
        const user: User = JSON.parse(JSON.stringify(rows[0]));

        // Send the updated user data in the response
        reply.send(user);
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};



export const deleteUser = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        // Get the user ID from the request parameters
        console.log(req.params);
        const UserID = parseInt(req.params.UserId, 10);
        // Check if UserID is a valid number
        if (isNaN(UserID)) {
            reply.status(400).send({ error: 'Invalid User ID', message: 'User ID must be a valid number' });
            return;
        }


        // Use the query method directly on the pool
        const [result]: any = await fastify.mysql.query('DELETE FROM users WHERE UserId = ?', [UserID]);

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


