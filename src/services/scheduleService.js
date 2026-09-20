const pool = require('../config/db');

async function checkScheduleConflict(facilityId,activityDate,startTime,endTime,activityId = null) {

    let query = `
        SELECT id, name, start_time, end_time
        FROM activities
        WHERE facility_id = $1
          AND activity_date = $2
          AND start_time < $4
          AND end_time > $3
    `;

    const params = [facilityId,activityDate,startTime,endTime];

    if (activityId !== null) {
        query += ` AND id <> $5`;
        params.push(activityId);
    }

    const result = await pool.query(query, params);

    return result.rows;
}

module.exports = {
    checkScheduleConflict
};