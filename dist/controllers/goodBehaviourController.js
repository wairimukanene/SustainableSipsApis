"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGoodBehavior = exports.updateGoodBehavior = exports.createGoodBehavior = exports.getGoodBehavior = exports.getGoodBehaviors = void 0;
const getGoodBehaviors = async (fastify, req, reply) => {
    try {
        // Use the query method directly on the pool
        const [rows, fields] = await fastify.mysql.query('SELECT * FROM GoodBehaviors');
        // Convert RowDataPacket objects to GoodBehavior objects
        const goodBehaviors = JSON.parse(JSON.stringify(rows));
        // Send the good behaviors data in the response
        reply.send(goodBehaviors);
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.getGoodBehaviors = getGoodBehaviors;
const getGoodBehavior = async (fastify, req, reply) => {
    try {
        // Get the good behavior ID from the request parameters
        const id = req.params.GoodBehaviorID;
        // Use the query method directly on the pool
        const [rows, fields] = await fastify.mysql.query(`SELECT * FROM GoodBehaviors WHERE GoodBehaviorID = ?`, [id]);
        // Convert RowDataPacket objects to GoodBehavior objects
        const goodBehavior = JSON.parse(JSON.stringify(rows[0]));
        // Check if the good behavior exists
        if (!goodBehavior) {
            reply.status(404).send({ error: 'Good Behavior Not Found' });
            return;
        }
        // Send the good behavior data in the response
        reply.send(goodBehavior);
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.getGoodBehavior = getGoodBehavior;
const createGoodBehavior = async (fastify, req, reply) => {
    try {
        // Get the good behavior data from the request body
        console.log(req.body);
        const goodBehaviorData = req.body.body;
        // Use the query method directly on the pool
        const [result] = await fastify.mysql.query('INSERT INTO GoodBehaviors (Name, Description,UserID) VALUES (?, ?,?)', [goodBehaviorData.Name, goodBehaviorData.Description, goodBehaviorData.UserID]);
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
        const [rows, fields] = await fastify.mysql.query(`SELECT * FROM GoodBehaviors WHERE GoodBehaviorID = ?`, [id]);
        // Convert RowDataPacket objects to GoodBehavior objects
        const goodBehavior = JSON.parse(JSON.stringify(rows[0]));
        // Send the created good behavior data in the response
        reply.send(goodBehavior);
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.createGoodBehavior = createGoodBehavior;
const updateGoodBehavior = async (fastify, req, reply) => {
    try {
        // Get the good behavior ID from the request parameters
        console.log(req.params);
        const goodBehaviorID = req.params.GoodBehaviorID;
        const newGoodBehaviorData = req.body;
        const values = Object.values(newGoodBehaviorData);
        console.log(values);
        const [result] = await fastify.mysql.query('UPDATE GoodBehaviors SET Name = ?, Description = ? WHERE GoodBehaviorID = ?', [newGoodBehaviorData.Name, newGoodBehaviorData.Description, goodBehaviorID]);
        console.log(result);
        // Check if the good behavior was updated
        if (!result.affectedRows) {
            reply.status(404).send({ error: 'Good Behavior Not Found' });
            return;
        }
        // Query the database for the updated good behavior
        const [rows, fields] = await fastify.mysql.query(`SELECT * FROM GoodBehaviors WHERE GoodBehaviorID = ?`, [goodBehaviorID]);
        console.log(rows[0]);
        // Convert RowDataPacket objects to GoodBehavior objects
        const goodBehavior = JSON.parse(JSON.stringify(rows[0]));
        // Send the updated good behavior data in the response
        reply.send(goodBehavior);
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.updateGoodBehavior = updateGoodBehavior;
const deleteGoodBehavior = async (fastify, req, reply) => {
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
        const [result] = await fastify.mysql.query('DELETE FROM GoodBehaviors WHERE GoodBehaviorID = ?', [goodBehaviorID]);
        // Check if the good behavior was deleted
        if (!result.affectedRows) {
            reply.status(404).send({ error: 'Good Behavior Not Found' });
            return;
        }
        // Update the user's points (for example, -1 for deleting good behavior)
        await updatePoints(req.body.body.UserID, 1, fastify);
        // Send a success message in the response
        reply.send({ message: 'Good Behavior deleted successfully' });
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.deleteGoodBehavior = deleteGoodBehavior;
// Helper function to update user points
async function updatePoints(userId, points, fastify) {
    // Update positive points in the database
    await fastify.mysql.query('UPDATE Users SET PositivePoints = PositivePoints + ? WHERE UserID = ?', [points, userId]);
}
