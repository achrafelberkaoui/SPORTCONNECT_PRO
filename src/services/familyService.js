const pool = require('../config/db');

async function getAllFamilies() {
    const result = await pool.query(`
        SELECT
            id,
            family_name,
            quotient_familial
        FROM families
        ORDER BY id
    `);

    return result.rows;
}

async function createFamily(familyName, quotientFamilial) {
    const result = await pool.query(
        `INSERT INTO families (
            family_name,
            quotient_familial
        )
        VALUES ($1, $2)
        RETURNING *`,
        [
            familyName,
            quotientFamilial
        ]
    );

    return result.rows[0];
}

async function updateFamily(
    id,
    familyName,
    quotientFamilial
) {
    const result = await pool.query(
        `UPDATE families
         SET
            family_name = $1,
            quotient_familial = $2
         WHERE id = $3
         RETURNING *`,
        [
            familyName,
            quotientFamilial,
            id
        ]
    );

    return result.rows[0];
}

async function deleteFamily(id) {
    await pool.query(
        `DELETE FROM families
         WHERE id = $1`,
        [id]
    );
}

module.exports = {
    getAllFamilies,
    createFamily,
    updateFamily,
    deleteFamily
};