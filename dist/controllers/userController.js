"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
const getUsers = async (fastify, req, reply) => {
    try {
        // Use the query method directly on the pool
        const [rows, fields] = await fastify.mysql.query('SELECT * FROM users');
        // Convert RowDataPacket objects to User objects
        const users = JSON.parse(JSON.stringify(rows));
        // Send the users data in the response
        reply.send(users);
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.getUsers = getUsers;
const getUser = async (fastify, req, reply) => {
    try {
        // Get the user ID from the request parameters
        const id = req.params.id;
        // Use the query method directly on the pool
        const [rows, fields] = await fastify.mysql.query(`SELECT * FROM users WHERE UserId = ?`, [id]);
        // Convert RowDataPacket objects to User objects
        const user = JSON.parse(JSON.stringify(rows[0]));
        // Check if the user exists
        if (!user) {
            reply.status(404).send({ error: 'User Not Found' });
            return;
        }
        // Send the user data in the response
        reply.send(user);
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.getUser = getUser;
const createUser = async (fastify, req, reply) => {
    try {
        // Get the user data from the request body
        console.log(req.body);
        const userData = req.body;
        // Use the query method directly on the pool
        const [result] = await fastify.mysql.query('INSERT INTO users ( Username, Email, Password) VALUES ( ?, ?, ?)', [userData.Username, userData.Email, userData.Password]);
        // Check if the user was created
        if (!result.affectedRows) {
            reply.status(500).send({ error: 'Internal Server Error', message: 'Failed to create user' });
            return;
        }
        // Get the ID of the created user
        const id = result.insertId;
        // Query the database for the created user
        const [rows, fields] = await fastify.mysql.query(`SELECT * FROM users WHERE UserId = ?`, [id]);
        // Convert RowDataPacket objects to User objects
        const user = JSON.parse(JSON.stringify(rows[0]));
        // Send the created user data in the response
        reply.send(user);
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.createUser = createUser;
const updateUser = async (fastify, req, reply) => {
    try {
        // Get the user ID from the request parameters
        console.log(req.params);
        const UserID = req.params.UserId;
        const newUserData = req.body;
        const values = Object.values(newUserData);
        console.log(values);
        const [result] = await fastify.mysql.query('UPDATE users SET Username = ?, Email = ?, Password = ? WHERE UserId = ?', [newUserData.Username, newUserData.Email, newUserData.Password, UserID]);
        console.log(result);
        // Check if the user was updated
        if (!result.affectedRows) {
            reply.status(404).send({ error: 'User Not Found' });
            return;
        }
        // Query the database for the updated user
        const [rows, fields] = await fastify.mysql.query(`SELECT * FROM users WHERE UserId = ?`, [UserID]);
        console.log(rows[0]);
        // Convert RowDataPacket objects to User objects
        const user = JSON.parse(JSON.stringify(rows[0]));
        // Send the updated user data in the response
        reply.send(user);
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (fastify, req, reply) => {
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
        const [result] = await fastify.mysql.query('DELETE FROM users WHERE UserId = ?', [UserID]);
        // Check if the user was deleted
        if (!result.affectedRows) {
            reply.status(404).send({ error: 'User Not Found' });
            return;
        }
        // Send a success message in the response
        reply.send({ message: 'User deleted successfully' });
    }
    catch (error) {
        reply.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};
exports.deleteUser = deleteUser;
