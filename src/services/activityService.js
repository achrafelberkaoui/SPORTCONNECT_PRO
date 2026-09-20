const pool = require('../config/db');
const scheduleService = require('./scheduleService');

async function getAllActivities() {

    const result = await pool.query(`
        SELECT
            activities.id,
            activities.name,
            activities.base_price,
            activities.max_capacity,
            activities.activity_date,
            activities.start_time,
            activities.end_time,
            activities.min_age,
            activities.max_age,
            activities.all_publics,
            activities.association_id,
            activities.facility_id,
            associations.name AS association_name,
            facilities.name AS facility_name
        FROM activities
        JOIN associations
            ON associations.id = activities.association_id
        JOIN facilities
            ON facilities.id = activities.facility_id
        ORDER BY activities.activity_date,
                 activities.start_time
    `);

    return result.rows;
}

async function checkErpCapacity(facilityId, maxCapacity) {

    const result = await pool.query(
        `SELECT erp_capacity
         FROM facilities
         WHERE id = $1`,
        [facilityId]
    );

    if (result.rows.length === 0) {
        throw new Error('Infrastructure introuvable');
    }

    const erpCapacity = result.rows[0].erp_capacity;

    if (maxCapacity > erpCapacity) {
        throw new Error(
            `La capacité de l'activité (${maxCapacity}) ` +
            `dépasse la capacité ERP (${erpCapacity})`
        );
    }
}

async function createActivity(
    name,
    basePrice,
    maxCapacity,
    activityDate,
    startTime,
    endTime,
    minAge,
    maxAge,
    allPublics,
    associationId,
    facilityId
) {

    await checkErpCapacity(
        facilityId,
        maxCapacity
    );

    const conflicts =
        await scheduleService.checkScheduleConflict(
            facilityId,
            activityDate,
            startTime,
            endTime
        );

    if (conflicts.length > 0) {
        throw new Error(
            'Cette infrastructure est déjà occupée sur ce créneau'
        );
    }

    const result = await pool.query(
        `INSERT INTO activities (
            name,
            base_price,
            max_capacity,
            activity_date,
            start_time,
            end_time,
            min_age,
            max_age,
            all_publics,
            association_id,
            facility_id
        )
        VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10, $11
        )
        RETURNING *`,
        [
            name,
            basePrice,
            maxCapacity,
            activityDate,
            startTime,
            endTime,
            minAge,
            maxAge,
            allPublics,
            associationId,
            facilityId
        ]
    );

    return result.rows[0];
}

async function updateActivity(
    id,
    name,
    basePrice,
    maxCapacity,
    activityDate,
    startTime,
    endTime,
    minAge,
    maxAge,
    allPublics,
    associationId,
    facilityId
) {

    await checkErpCapacity(
        facilityId,
        maxCapacity
    );

    const conflicts =
        await scheduleService.checkScheduleConflict(
            facilityId,
            activityDate,
            startTime,
            endTime,
            id
        );

    if (conflicts.length > 0) {
        throw new Error(
            'Cette infrastructure est déjà occupée sur ce créneau'
        );
    }

    const result = await pool.query(
        `UPDATE activities
         SET
            name = $1,
            base_price = $2,
            max_capacity = $3,
            activity_date = $4,
            start_time = $5,
            end_time = $6,
            min_age = $7,
            max_age = $8,
            all_publics = $9,
            association_id = $10,
            facility_id = $11
         WHERE id = $12
         RETURNING *`,
        [
            name,
            basePrice,
            maxCapacity,
            activityDate,
            startTime,
            endTime,
            minAge,
            maxAge,
            allPublics,
            associationId,
            facilityId,
            id
        ]
    );

    return result.rows[0];
}

async function deleteActivity(id) {

    await pool.query(
        `DELETE FROM activities
         WHERE id = $1`,
        [id]
    );
}

async function getActivityFormData() {
    const associationsResult = await pool.query(`
        SELECT id, name
        FROM associations
        ORDER BY name
    `);

    const facilitiesResult = await pool.query(`
        SELECT id, name, erp_capacity
        FROM facilities
        ORDER BY name
    `);

    return {
        associations: associationsResult.rows,
        facilities: facilitiesResult.rows
    };
}

module.exports = {
    getAllActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    getActivityFormData
};