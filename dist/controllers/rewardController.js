"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awardReward = exports.deleteReward = exports.updateReward = exports.createReward = exports.getReward = exports.getRewards = void 0;
const getRewards = async (fastify, req, reply) => {
    try {
        const [rows, fields] = await fastify.mysql.query('SELECT * FROM Rewards');
        const rewards = JSON.parse(JSON.stringify(rows));
        reply.send(rewards);
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.getRewards = getRewards;
const getReward = async (fastify, req, reply) => {
    try {
        const id = req.params.RewardID;
        const [rows, fields] = await fastify.mysql.query(`SELECT * FROM Rewards WHERE RewardID = ?`, [id]);
        const reward = JSON.parse(JSON.stringify(rows[0]));
        if (!reward) {
            reply.status(404).send({ error: 'Reward Not Found' });
            return;
        }
        reply.send(reward);
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.getReward = getReward;
const createReward = async (fastify, req, reply) => {
    try {
        const rewardData = req.body;
        const [result] = await fastify.mysql.query('INSERT INTO Rewards (Name, Description,Value) VALUES (?, ?,?)', [rewardData.Name, rewardData.Description, rewardData.Value]);
        if (!result.affectedRows) {
            reply.status(500).send({ error: 'Internal Server Error', message: 'Failed to create reward' });
            return;
        }
        const id = result.insertId;
        const [rows, fields] = await fastify.mysql.query(`SELECT * FROM Rewards WHERE RewardID = ?`, [id]);
        const reward = JSON.parse(JSON.stringify(rows[0]));
        reply.send(reward);
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.createReward = createReward;
const updateReward = async (fastify, req, reply) => {
    try {
        const rewardID = req.params.RewardID;
        const newRewardData = req.body;
        const values = Object.values(newRewardData);
        const [result] = await fastify.mysql.query('UPDATE Rewards SET Name = ?, Description = ?, Value = ? WHERE RewardID = ?', [newRewardData.Name, newRewardData.Description, newRewardData.Value, rewardID]);
        if (!result.affectedRows) {
            reply.status(404).send({ error: 'Reward Not Found' });
            return;
        }
        const [rows, fields] = await fastify.mysql.query(`SELECT * FROM Rewards WHERE RewardID = ?`, [rewardID]);
        const reward = JSON.parse(JSON.stringify(rows[0]));
        reply.send(reward);
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.updateReward = updateReward;
const deleteReward = async (fastify, req, reply) => {
    try {
        const rewardID = parseInt(req.params.RewardID, 10);
        if (isNaN(rewardID)) {
            reply.status(400).send({ error: 'Invalid Reward ID', message: 'Reward ID must be a valid number' });
            return;
        }
        const [result] = await fastify.mysql.query('DELETE FROM Rewards WHERE RewardID = ?', [rewardID]);
        if (!result.affectedRows) {
            reply.status(404).send({ error: 'Reward Not Found' });
            return;
        }
        reply.send({ message: 'Reward deleted successfully' });
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.deleteReward = deleteReward;
const awardReward = async (fastify, req, reply) => {
    try {
        // Query to find the user with the most positive points
        const [userRows] = await fastify.mysql.query('SELECT UserID, PositivePoints FROM users ORDER BY PositivePoints DESC LIMIT 1');
        if (userRows.length === 0) {
            reply.status(404).send({ error: 'No users found' });
            return;
        }
        const { UserID, PositivePoints } = userRows[0];
        // You may want to define a threshold for positive points to determine eligibility for a reward
        const positivePointsThreshold = 2; // Adjust as needed
        if (PositivePoints >= positivePointsThreshold) {
            // Award a reward to the user with the most positive points
            const [result] = await fastify.mysql.query('INSERT INTO rewards (UserID, Name, Description, Value) VALUES (?, ?, ?, ?)', [UserID, 'Top Performer Reward', 'Congratulations on being the top performer!', 50]);
            if (!result.affectedRows) {
                reply.status(500).send({ error: 'Internal Server Error', message: 'Failed to award reward' });
                return;
            }
            const rewardID = result.insertId;
            const [rewardRows] = await fastify.mysql.query('SELECT * FROM rewards WHERE RewardID = ?', [rewardID]);
            const reward = JSON.parse(JSON.stringify(rewardRows[0]));
            reply.send({ message: 'Reward awarded successfully', reward });
        }
        else {
            reply.send({ message: 'No eligible users for a reward' });
        }
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.awardReward = awardReward;
