const pool = require('../config/db');

async function getAllFacilities() {

    const result = await pool.query(`
        SELECT id, name, type, erp_capacity
        FROM facilities
        ORDER BY id
    `);

    return result.rows;
}

module.exports = {
    getAllFacilities
};