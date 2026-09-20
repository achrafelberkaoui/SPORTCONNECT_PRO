const pool = require('../config/db');

async function getAllMembers() {
    const result = await pool.query(`
        SELECT
            members.id,
            members.first_name,
            members.last_name,
            members.date_of_birth,
            members.is_resident,
            members.family_id,
            members.medical_certificate_date,
            members.pass_sport_code,
            families.family_name,
            families.quotient_familial
        FROM members
        LEFT JOIN families
            ON families.id = members.family_id
        ORDER BY members.id
    `);

    return result.rows;
}

async function getAllFamilies() {
    const result = await pool.query(`
        SELECT id, family_name, quotient_familial
        FROM families
        ORDER BY family_name
    `);

    return result.rows;
}

async function createMember(
    firstName,
    lastName,
    dateOfBirth,
    isResident,
    familyId,
    medicalCertificateDate,
    passSportCode
) {
    const result = await pool.query(
        `INSERT INTO members (
            first_name,
            last_name,
            date_of_birth,
            is_resident,
            family_id,
            medical_certificate_date,
            pass_sport_code
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
            firstName,
            lastName,
            dateOfBirth,
            isResident,
            familyId,
            medicalCertificateDate || null,
            passSportCode || null
        ]
    );

    return result.rows[0];
}

async function updateMember(
    id,
    firstName,
    lastName,
    dateOfBirth,
    isResident,
    familyId,
    medicalCertificateDate,
    passSportCode
) {
    const result = await pool.query(
        `UPDATE members
         SET
            first_name = $1,
            last_name = $2,
            date_of_birth = $3,
            is_resident = $4,
            family_id = $5,
            medical_certificate_date = $6,
            pass_sport_code = $7
         WHERE id = $8
         RETURNING *`,
        [
            firstName,
            lastName,
            dateOfBirth,
            isResident,
            familyId,
            medicalCertificateDate || null,
            passSportCode || null,
            id
        ]
    );

    return result.rows[0];
}

async function deleteMember(id) {
    await pool.query(
        `DELETE FROM members
         WHERE id = $1`,
        [id]
    );
}

module.exports = {
    getAllMembers,
    getAllFamilies,
    createMember,
    updateMember,
    deleteMember
};