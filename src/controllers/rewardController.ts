import { RouteGenericInterface, FastifyRequest, FastifyReply, RawServerDefault } from 'fastify';
import { Reward } from '../models/Rewards';
import { MySQLPromisePool } from '@fastify/mysql';
import { IncomingMessage } from 'http';
import { RowDataPacket, FieldPacket } from 'mysql2';

// Define an interface for your route parameters
interface RouteParams extends RouteGenericInterface {
    RewardID: any;
    id: string;
}

interface RequestBody {
    body: Reward;
}

// Extend the FastifyRequest interface to include the mysql property and the body property
export interface CustomRequest extends FastifyRequest<{ Params: RouteParams, Body: { body: Reward } }, RawServerDefault, IncomingMessage> {
    mysql: MySQLPromisePool;
    body: RequestBody;
}

export const getRewards = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await fastify.mysql.query('SELECT * FROM Rewards');
        const rewards: Reward[] = JSON.parse(JSON.stringify(rows));
        reply.send(rewards);
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};

export const getReward = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        const id = req.params.RewardID;
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await fastify.mysql.query(`SELECT * FROM Rewards WHERE RewardID = ?`, [id]);
        const reward: Reward = JSON.parse(JSON.stringify(rows[0]));

        if (!reward) {
            reply.status(404).send({ error: 'Reward Not Found' });
            return;
        }

        reply.send(reward);
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};

export const createReward = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        const rewardData: any = req.body;
        const [result]: any = await fastify.mysql.query('INSERT INTO Rewards (Name, Description,Value) VALUES (?, ?,?)', [rewardData.Name, rewardData.Description, rewardData.Value]);

        if (!result.affectedRows) {
            reply.status(500).send({ error: 'Internal Server Error', message: 'Failed to create reward' });
            return;
        }

        const id = result.insertId;
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await fastify.mysql.query(`SELECT * FROM Rewards WHERE RewardID = ?`, [id]);
        const reward: Reward = JSON.parse(JSON.stringify(rows[0]));

        reply.send(reward);
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};

export const updateReward = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        const rewardID = req.params.RewardID;
        const newRewardData: any = req.body;
        const values = Object.values(newRewardData);
        const [result]: any = await fastify.mysql.query('UPDATE Rewards SET Name = ?, Description = ?, Value = ? WHERE RewardID = ?', [newRewardData.Name, newRewardData.Description, newRewardData.Value, rewardID]);


        if (!result.affectedRows) {
            reply.status(404).send({ error: 'Reward Not Found' });
            return;
        }

        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await fastify.mysql.query(`SELECT * FROM Rewards WHERE RewardID = ?`, [rewardID]);
        const reward: Reward = JSON.parse(JSON.stringify(rows[0]));

        reply.send(reward);
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};

export const deleteReward = async (fastify: any, req: CustomRequest, reply: FastifyReply) => {
    try {
        const rewardID = parseInt(req.params.RewardID, 10);

        if (isNaN(rewardID)) {
            reply.status(400).send({ error: 'Invalid Reward ID', message: 'Reward ID must be a valid number' });
            return;
        }

        const [result]: any = await fastify.mysql.query('DELETE FROM Rewards WHERE RewardID = ?', [rewardID]);

        if (!result.affectedRows) {
            reply.status(404).send({ error: 'Reward Not Found' });
            return;
        }

        reply.send({ message: 'Reward deleted successfully' });
    } catch (error: any) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
