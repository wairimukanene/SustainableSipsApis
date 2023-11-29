import { RouteGenericInterface, FastifyRequest, FastifyReply, RawServerDefault } from 'fastify';
import { BadBehavior } from '../models/BadBehaviour';
import { MySQLPromisePool } from '@fastify/mysql';
import { IncomingMessage } from 'http';
import { RowDataPacket, FieldPacket } from 'mysql2';

// Define an interface for your route parameters
interface RouteParams extends RouteGenericInterface {
    BadBehaviorID: any;
    id: string;
}
interface RequestBody {
    body: BadBehavior;
}


// Extend the FastifyRequest interface to include the mysql property and the body property
export interface CustomRequest extends FastifyRequest<{ Params: RouteParams, Body: { body: BadBehavior } }, RawServerDefault, IncomingMessage> {
    mysql: MySQLPromisePool;
    body: RequestBody;
}


export const getBadBehaviors = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        // Use the query method directly on the pool
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await fastify.mysql.query('SELECT * FROM BadBehaviors');

        // Convert RowDataPacket objects to BadBehavior objects
        const badBehaviors: BadBehavior[] = JSON.parse(JSON.stringify(rows));

        // Send the bad behaviors data in the response
        reply.send(badBehaviors);
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};

export const getBadBehavior = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        // Get the bad behavior ID from the request parameters
        const id = req.params.BadBehaviorID;

        // Use the query method directly on the pool
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await fastify.mysql.query(`SELECT * FROM BadBehaviors WHERE BadBehaviorID = ?`, [id]);

        // Convert RowDataPacket objects to BadBehavior objects
        const badBehavior: BadBehavior = JSON.parse(JSON.stringify(rows[0]));

        // Check if the bad behavior exists
        if (!badBehavior) {
            reply.status(404).send({ error: 'Bad Behavior Not Found' });
            return;
        }

        // Send the bad behavior data in the response
        reply.send(badBehavior);
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};

export const createBadBehavior = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        // Get the bad behavior data from the request body
        console.log(req.body);
        //const badBehaviorData: BadBehavior = req.body;
        const badBehaviorData: any = req.body.body;

        // Use the query method directly on the pool
        const [result]: any = await fastify.mysql.query('INSERT INTO BadBehaviors (Name, Description,UserID) VALUES (?, ?,?)', [badBehaviorData.Name, badBehaviorData.Description, badBehaviorData.UserID]);

        // Check if the bad behavior was created
        if (!result.affectedRows) {
            reply.status(500).send({ error: 'Internal Server Error', message: 'Failed to create bad behavior' });
            return;
        }

        // Get the ID of the created bad behavior
        const id = result.insertId;
        // Update the user's points (for example, +1 for bad  behavior)
        await updatePoints(req.body.body.UserID, 2, fastify);



        // Query the database for the created bad behavior
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await fastify.mysql.query(`SELECT * FROM BadBehaviors WHERE BadBehaviorID = ?`, [id]);

        // Convert RowDataPacket objects to BadBehavior objects
        const badBehavior: BadBehavior = JSON.parse(JSON.stringify(rows[0]));

        // Send the created bad behavior data in the response
        reply.send(badBehavior);
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};

export const updateBadBehavior = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        // Get the bad behavior ID from the request parameters
        console.log(req.params);
        const badBehaviorID = req.params.BadBehaviorID;

        const newBadBehaviorData: any = req.body;

        const values = Object.values(newBadBehaviorData);
        console.log(values);



        const [result]: any = await fastify.mysql.query('UPDATE BadBehaviors SET Name = ?, Description = ? WHERE BadBehaviorID = ?', [newBadBehaviorData.Name, newBadBehaviorData.Description, badBehaviorID]);

        console.log(result);

        // Check if the bad behavior was updated
        if (!result.affectedRows) {
            reply.status(404).send({ error: 'Bad Behavior Not Found' });
            return;
        }

        // Query the database for the updated bad behavior
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await fastify.mysql.query(`SELECT * FROM BadBehaviors WHERE BadBehaviorID = ?`, [badBehaviorID]);
        console.log(rows[0]);

        // Convert RowDataPacket objects to BadBehavior objects
        const badBehavior: BadBehavior = JSON.parse(JSON.stringify(rows[0]));

        // Send the updated bad behavior data in the response
        reply.send(badBehavior);
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};

export const deleteBadBehavior = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        // Get the bad behavior ID from the request parameters
        console.log(req.params);
        const badBehaviorID = parseInt(req.params.BadBehaviorID, 10);
        // Check if badBehaviorID is a valid number
        if (isNaN(badBehaviorID)) {
            reply.status(400).send({ error: 'Invalid Bad Behavior ID', message: 'Bad Behavior ID must be a valid number' });
            return;
        }

        // Use the query method directly on the pool
        const [result]: any = await fastify.mysql.query('DELETE FROM BadBehaviors WHERE BadBehaviorID = ?', [badBehaviorID]);

        // Check if the bad behavior was deleted
        if (!result.affectedRows) {
            reply.status(404).send({ error: 'Bad Behavior Not Found' });
            return;
        }
        // Update the user's points (for example, -1 for deleting bad behavior)
        await updatePoints(req.body.body.UserID, -1, fastify);


        // Send a success message in the response
        reply.send({ message: 'Bad Behavior deleted successfully' });
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
// Helper function to update user points
async function updatePoints(userId: number, points: number, fastify: any) {
    // Update positive points in the database
    await fastify.mysql.query('UPDATE Users SET NegativePoints = NegativePoints + ? WHERE UserID = ?', [points, userId]);

    console.log('Points updated successfully');
}