import { RouteGenericInterface, FastifyRequest, FastifyReply, RawServerDefault } from 'fastify';
import { GoodBehavior } from '../models/GoodBehaviour';
import { MySQLPromisePool } from '@fastify/mysql';
import { IncomingMessage } from 'http';
import { RowDataPacket, FieldPacket } from 'mysql2';

// Define an interface for your route parameters
interface RouteParams extends RouteGenericInterface {
    GoodBehaviorID: any;
    id: string;
}
interface RequestBody {
    body: GoodBehavior;
}

export interface CustomRequest extends FastifyRequest<{ Params: RouteParams, Body: { body: GoodBehavior } }, RawServerDefault, IncomingMessage> {
    mysql: MySQLPromisePool;
    body: RequestBody;
}


export const getGoodBehaviors = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        // Use the query method directly on the pool
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await fastify.mysql.query('SELECT * FROM GoodBehaviors');

        // Convert RowDataPacket objects to GoodBehavior objects
        const goodBehaviors: GoodBehavior[] = JSON.parse(JSON.stringify(rows));

        // Send the good behaviors data in the response
        reply.send(goodBehaviors);
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};

export const getGoodBehavior = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        // Get the good behavior ID from the request parameters
        const id = req.params.GoodBehaviorID;

        // Use the query method directly on the pool
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await fastify.mysql.query(`SELECT * FROM GoodBehaviors WHERE GoodBehaviorID = ?`, [id]);

        // Convert RowDataPacket objects to GoodBehavior objects
        const goodBehavior: GoodBehavior = JSON.parse(JSON.stringify(rows[0]));

        // Check if the good behavior exists
        if (!goodBehavior) {
            reply.status(404).send({ error: 'Good Behavior Not Found' });
            return;
        }

        // Send the good behavior data in the response
        reply.send(goodBehavior);
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};

export const createGoodBehavior = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        // Get the good behavior data from the request body
        console.log(req.body);
        const goodBehaviorData: any = req.body.body;

        // Use the query method directly on the pool
        const [result]: any = await fastify.mysql.query('INSERT INTO GoodBehaviors (Name, Description,UserID) VALUES (?, ?,?)', [goodBehaviorData.Name, goodBehaviorData.Description, goodBehaviorData.UserID]);

        // Check if the good behavior was created
        if (!result.affectedRows) {
            reply.status(500).send({ error: 'Internal Server Error', message: 'Failed to create good behavior' });
            return;
        }

        // Get the ID of the created good behavior
        const id = result.insertId;

        // Update the user's points (for example, +1 for good behavior)
        await updatePoints(req.body.body.UserID, -1, fastify);




        // Query the database for the created good behavior
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await fastify.mysql.query(`SELECT * FROM GoodBehaviors WHERE GoodBehaviorID = ?`, [id]);

        // Convert RowDataPacket objects to GoodBehavior objects
        const goodBehavior: GoodBehavior = JSON.parse(JSON.stringify(rows[0]));

        // Send the created good behavior data in the response
        reply.send(goodBehavior);
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};

export const updateGoodBehavior = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        // Get the good behavior ID from the request parameters
        console.log(req.params);
        const goodBehaviorID = req.params.GoodBehaviorID;

        const newGoodBehaviorData: any = req.body;

        const values = Object.values(newGoodBehaviorData);
        console.log(values);

        const [result]: any = await fastify.mysql.query('UPDATE GoodBehaviors SET Name = ?, Description = ? WHERE GoodBehaviorID = ?', [newGoodBehaviorData.Name, newGoodBehaviorData.Description, goodBehaviorID]);

        console.log(result);

        // Check if the good behavior was updated
        if (!result.affectedRows) {
            reply.status(404).send({ error: 'Good Behavior Not Found' });
            return;
        }

        // Query the database for the updated good behavior
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await fastify.mysql.query(`SELECT * FROM GoodBehaviors WHERE GoodBehaviorID = ?`, [goodBehaviorID]);
        console.log(rows[0]);

        // Convert RowDataPacket objects to GoodBehavior objects
        const goodBehavior: GoodBehavior = JSON.parse(JSON.stringify(rows[0]));

        // Send the updated good behavior data in the response
        reply.send(goodBehavior);
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};

export const deleteGoodBehavior = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        // Get the good behavior ID from the request parameters
        console.log(req.params);
        const goodBehaviorID = parseInt(req.params.GoodBehaviorID, 10);
        // Check if goodBehaviorID is a valid number
        if (isNaN(goodBehaviorID)) {
            reply.status(400).send({ error: 'Invalid Good Behavior ID', message: 'Good Behavior ID must be a valid number' });
            return;
        }

        // Use the query method directly on the pool
        const [result]: any = await fastify.mysql.query('DELETE FROM GoodBehaviors WHERE GoodBehaviorID = ?', [goodBehaviorID]);

        // Check if the good behavior was deleted
        if (!result.affectedRows) {
            reply.status(404).send({ error: 'Good Behavior Not Found' });
            return;
        }
        // Update the user's points (for example, -1 for deleting good behavior)
        await updatePoints(req.body.body.UserID, 1, fastify);





        // Send a success message in the response
        reply.send({ message: 'Good Behavior deleted successfully' });
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};

// Helper function to update user points
async function updatePoints(userId: number, points: number, fastify: any) {
    // Update positive points in the database
    await fastify.mysql.query('UPDATE Users SET PositivePoints = PositivePoints + ? WHERE UserID = ?', [points, userId]);
}