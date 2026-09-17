const pool = require('../config/db');

async function getAllFacilities() {

    const result = await pool.query(`
        SELECT id, name, type, erp_capacity
        FROM facilities
        ORDER BY id
    `);

    return result.rows;
}

async function createFacility(name, type, erpCapacity) {

    const result = await pool.query(
        `INSERT INTO facilities
            (name, type, erp_capacity)
         VALUES
            ($1, $2, $3)
         RETURNING *`,
        [name, type, erpCapacity]
    );

    return result.rows[0];
}

async function updateFacility(id, name, type, erpCapacity) {

    const result = await pool.query(
        `UPDATE facilities
         SET name = $1,
             type = $2,
             erp_capacity = $3
         WHERE id = $4
         RETURNING *`,
        [name, type, erpCapacity, id]
    );

    return result.rows[0];
}

async function deleteFacility(id) {

    await pool.query(
        `DELETE FROM facilities
         WHERE id = $1`,
        [id]
    );
}

module.exports = {
    getAllFacilities,
    createFacility,
    updateFacility,
    deleteFacility
};