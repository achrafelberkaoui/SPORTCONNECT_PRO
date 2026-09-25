const pool = require('../config/db');

async function getDashboardStats() {

    const membersResult = await pool.query(`
        SELECT COUNT(*) AS count
        FROM members
    `);

    const familiesResult = await pool.query(`
        SELECT COUNT(*) AS count
        FROM families
    `);

    const facilitiesResult = await pool.query(`
        SELECT COUNT(*) AS count
        FROM facilities
    `);

    const associationsResult = await pool.query(`
        SELECT COUNT(*) AS count
        FROM associations
    `);

    const activitiesResult = await pool.query(`
        SELECT COUNT(*) AS count
        FROM activities
    `);

    const registrationsResult = await pool.query(`
        SELECT COUNT(*) AS count
        FROM registrations
        WHERE status IN ('confirmed', 'medical_non_compliant')
    `);

    const waitingListResult = await pool.query(`
        SELECT COUNT(*) AS count
        FROM waiting_list
        WHERE status IN ('waiting', 'promoted_pending')
    `);

    return {
        members: Number(membersResult.rows[0].count),
        families: Number(familiesResult.rows[0].count),
        facilities: Number(facilitiesResult.rows[0].count),
        associations: Number(associationsResult.rows[0].count),
        activities: Number(activitiesResult.rows[0].count),
        registrations: Number(registrationsResult.rows[0].count),
        waitingList: Number(waitingListResult.rows[0].count)
    };
}

async function getActivityOccupancy() {
    const result = await pool.query(`
        SELECT
            activities.id,
            activities.name,
            activities.max_capacity,
            COUNT(
                registrations.id
            ) FILTER (
                WHERE registrations.status IN (
                    'confirmed',
                    'medical_non_compliant'
                )
            ) AS registered_count
        FROM activities
        LEFT JOIN registrations
            ON registrations.activity_id = activities.id
        GROUP BY
            activities.id,
            activities.name,
            activities.max_capacity
        ORDER BY
            registered_count DESC,
            activities.name
    `);

    return result.rows.map(activity => {
        const registeredCount =
            Number(activity.registered_count);

        const maxCapacity =
            Number(activity.max_capacity);

        const occupancy =
            maxCapacity > 0
                ? Math.round(
                    (registeredCount / maxCapacity) * 100
                )
                : 0;

        return {
            id: activity.id,
            name: activity.name,
            maxCapacity,
            registeredCount,
            occupancy
        };
    });
}

async function getUpcomingActivities() {
    const result = await pool.query(`
        SELECT
            activities.id,
            activities.name,
            activities.activity_date,
            activities.start_time,
            activities.end_time,
            facilities.name AS facility_name,
            associations.name AS association_name
        FROM activities
        JOIN facilities
            ON facilities.id = activities.facility_id
        JOIN associations
            ON associations.id = activities.association_id
        WHERE activities.activity_date >= CURRENT_DATE
        ORDER BY
            activities.activity_date ASC,
            activities.start_time ASC
        LIMIT 5
    `);

    return result.rows;
}


module.exports = {
    getDashboardStats,
    getActivityOccupancy,
    getUpcomingActivities
};