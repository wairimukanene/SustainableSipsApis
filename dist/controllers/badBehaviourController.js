"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBadBehavior = exports.updateBadBehavior = exports.createBadBehavior = exports.getBadBehavior = exports.getBadBehaviors = void 0;
const getBadBehaviors = async (fastify, req, reply) => {
    try {
        // Use the query method directly on the pool
        const [rows, fields] = await fastify.mysql.query('SELECT * FROM BadBehaviors');
        // Convert RowDataPacket objects to BadBehavior objects
        const badBehaviors = JSON.parse(JSON.stringify(rows));
        // Send the bad behaviors data in the response
        reply.send(badBehaviors);
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.getBadBehaviors = getBadBehaviors;
const getBadBehavior = async (fastify, req, reply) => {
    try {
        // Get the bad behavior ID from the request parameters
        const id = req.params.BadBehaviorID;
        // Use the query method directly on the pool
        const [rows, fields] = await fastify.mysql.query(`SELECT * FROM BadBehaviors WHERE BadBehaviorID = ?`, [id]);
        // Convert RowDataPacket objects to BadBehavior objects
        const badBehavior = JSON.parse(JSON.stringify(rows[0]));
        // Check if the bad behavior exists
        if (!badBehavior) {
            reply.status(404).send({ error: 'Bad Behavior Not Found' });
            return;
        }
        // Send the bad behavior data in the response
        reply.send(badBehavior);
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.getBadBehavior = getBadBehavior;
const createBadBehavior = async (fastify, req, reply) => {
    try {
        // Get the bad behavior data from the request body
        console.log(req.body);
        //const badBehaviorData: BadBehavior = req.body;
        const badBehaviorData = req.body;
        // Use the query method directly on the pool
        const [result] = await fastify.mysql.query('INSERT INTO BadBehaviors (Name, Description) VALUES (?, ?)', [badBehaviorData.Name, badBehaviorData.Description]);
        // Check if the bad behavior was created
        if (!result.affectedRows) {
            reply.status(500).send({ error: 'Internal Server Error', message: 'Failed to create bad behavior' });
            return;
        }
        // Get the ID of the created bad behavior
        const id = result.insertId;
        // Query the database for the created bad behavior
        const [rows, fields] = await fastify.mysql.query(`SELECT * FROM BadBehaviors WHERE BadBehaviorID = ?`, [id]);
        // Convert RowDataPacket objects to BadBehavior objects
        const badBehavior = JSON.parse(JSON.stringify(rows[0]));
        // Send the created bad behavior data in the response
        reply.send(badBehavior);
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.createBadBehavior = createBadBehavior;
const updateBadBehavior = async (fastify, req, reply) => {
    try {
        // Get the bad behavior ID from the request parameters
        console.log(req.params);
        const badBehaviorID = req.params.BadBehaviorID;
        const newBadBehaviorData = req.body;
        const values = Object.values(newBadBehaviorData);
        console.log(values);
        const [result] = await fastify.mysql.query('UPDATE BadBehaviors SET Name = ?, Description = ? WHERE BadBehaviorID = ?', [newBadBehaviorData.Name, newBadBehaviorData.Description, badBehaviorID]);
        console.log(result);
        // Check if the bad behavior was updated
        if (!result.affectedRows) {
            reply.status(404).send({ error: 'Bad Behavior Not Found' });
            return;
        }
        // Query the database for the updated bad behavior
        const [rows, fields] = await fastify.mysql.query(`SELECT * FROM BadBehaviors WHERE BadBehaviorID = ?`, [badBehaviorID]);
        console.log(rows[0]);
        // Convert RowDataPacket objects to BadBehavior objects
        const badBehavior = JSON.parse(JSON.stringify(rows[0]));
        // Send the updated bad behavior data in the response
        reply.send(badBehavior);
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.updateBadBehavior = updateBadBehavior;
const deleteBadBehavior = async (fastify, req, reply) => {
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
        const [result] = await fastify.mysql.query('DELETE FROM BadBehaviors WHERE BadBehaviorID = ?', [badBehaviorID]);
        // Check if the bad behavior was deleted
        if (!result.affectedRows) {
            reply.status(404).send({ error: 'Bad Behavior Not Found' });
            return;
        }
        // Send a success message in the response
        reply.send({ message: 'Bad Behavior deleted successfully' });
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.deleteBadBehavior = deleteBadBehavior;
