const pool = require('../config/db');

async function getAllAssociations() {
    const result = await pool.query(`
        SELECT id, name, description
        FROM associations
        ORDER BY id
    `);

    return result.rows;
}

async function createAssociation(name, description) {
    const result = await pool.query(
        `INSERT INTO associations (name, description)
         VALUES ($1, $2)
         RETURNING *`,
        [name, description]
    );

    return result.rows[0];
}

async function updateAssociation(id, name, description) {
    const result = await pool.query(
        `UPDATE associations
         SET name = $1,
             description = $2
         WHERE id = $3
         RETURNING *`,
        [name, description, id]
    );

    return result.rows[0];
}

async function deleteAssociation(id) {
    await pool.query(
        `DELETE FROM associations
         WHERE id = $1`,
        [id]
    );
}

module.exports = {
    getAllAssociations,
    createAssociation,
    updateAssociation,
    deleteAssociation
};