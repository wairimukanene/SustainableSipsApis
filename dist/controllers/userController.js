"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
const getUsers = async (req, reply) => {
    try {
        // Use the query method directly on the pool
        const [rows, fields] = await req.mysql.query('SELECT * FROM users');
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
const getUser = async (req, reply) => {
    try {
        // Get the user ID from the request parameters
        const id = req.params.id;
        // Use the query method directly on the pool
        const [rows, fields] = await req.mysql.query(`SELECT * FROM users WHERE UserId = ?`, [id]);
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
const createUser = async (req, reply) => {
    try {
        // Get the user data from the request body
        const userData = req.body.body;
        // Use the query method directly on the pool
        const [result] = await req.mysql.query('INSERT INTO users SET ?', userData);
        // Check if the user was created
        if (!result.affectedRows) {
            reply.status(500).send({ error: 'Internal Server Error', message: 'Failed to create user' });
            return;
        }
        // Get the ID of the created user
        const id = result.insertId;
        // Query the database for the created user
        const [rows, fields] = await req.mysql.query(`SELECT * FROM users WHERE id = ?`, [id]);
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
const updateUser = async (req, reply) => {
    try {
        // Get the user ID from the request parameters
        const id = req.params.id;
        // Get the new user data from the request body
        const newUserData = req.body.body;
        // Use the query method directly on the pool
        const [result] = await req.mysql.query('UPDATE users SET ? WHERE id = ?', [newUserData, id]);
        // Check if the user was updated
        if (!result.affectedRows) {
            reply.status(404).send({ error: 'User Not Found' });
            return;
        }
        // Query the database for the updated user
        const [rows, fields] = await req.mysql.query(`SELECT * FROM users WHERE id = ?`, [id]);
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
const deleteUser = async (req, reply) => {
    try {
        // Get the user ID from the request parameters
        const id = req.params.id;
        // Use the query method directly on the pool
        const [result] = await req.mysql.query('DELETE FROM users WHERE id = ?', [id]);
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
