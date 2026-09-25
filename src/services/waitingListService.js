const pool = require('../config/db');

async function addToWaitingList(memberId, activityId, priorityScore) {
    const result = await pool.query(`
        INSERT INTO waiting_list (
            member_id,
            activity_id,
            priority_score,
            status
        )
        VALUES ($1, $2, $3, 'waiting')
        RETURNING *
    `, [
        memberId,
        activityId,
        priorityScore
    ]);

    return result.rows[0];
}


async function getWaitingList(activityId) {
    const result = await pool.query(`
        SELECT
            waiting_list.id,
            waiting_list.member_id,
            waiting_list.activity_id,
            waiting_list.priority_score,
            waiting_list.status,
            waiting_list.created_at,
            waiting_list.deadline_confirmation,
            members.first_name,
            members.last_name
        FROM waiting_list
        JOIN members
            ON members.id = waiting_list.member_id
        WHERE waiting_list.activity_id = $1
          AND waiting_list.status IN ('waiting', 'promoted_pending')
        ORDER BY
            waiting_list.priority_score DESC,
            waiting_list.created_at ASC
    `, [activityId]);

    return result.rows;
}


async function promoteNextMember(activityId) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(`
            SELECT
                id,
                member_id,
                activity_id
            FROM waiting_list
            WHERE activity_id = $1
              AND status = 'waiting'
            ORDER BY
                priority_score DESC,
                created_at ASC
            LIMIT 1
            FOR UPDATE SKIP LOCKED
        `, [activityId]);

        if (result.rows.length === 0) {
            await client.query('COMMIT');
            return null;
        }

        const waiting = result.rows[0];

        const updated = await client.query(`
            UPDATE waiting_list
            SET
                status = 'promoted_pending',
                deadline_confirmation = CURRENT_TIMESTAMP + INTERVAL '48 hours'
            WHERE id = $1
            RETURNING *
        `, [waiting.id]);

        await client.query('COMMIT');

        return updated.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}


async function confirmPromotion(waitingListId) {
    const result = await pool.query(`
        UPDATE waiting_list
        SET status = 'confirmed'
        WHERE id = $1
          AND status = 'promoted_pending'
          AND deadline_confirmation >= CURRENT_TIMESTAMP
        RETURNING *
    `, [waitingListId]);

    if (result.rows.length === 0) {
        throw new Error(
            'Promotion introuvable ou délai de confirmation dépassé'
        );
    }

    return result.rows[0];
}


async function expirePromotions() {
    const result = await pool.query(`
        UPDATE waiting_list
        SET status = 'expired'
        WHERE status = 'promoted_pending'
          AND deadline_confirmation < CURRENT_TIMESTAMP
        RETURNING *
    `);

    return result.rows;
}

async function cancelRegistrationAndPromote(registrationId) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const registrationResult = await client.query(`
            SELECT activity_id
            FROM registrations
            WHERE id = $1
            FOR UPDATE
        `, [registrationId]);

        if (registrationResult.rows.length === 0) {
            throw new Error('Inscription introuvable');
        }

        const activityId = registrationResult.rows[0].activity_id;

        await client.query(`
            UPDATE registrations
            SET status = 'cancelled'
            WHERE id = $1
        `, [registrationId]);

        const waitingResult = await client.query(`
            SELECT id
            FROM waiting_list
            WHERE activity_id = $1
              AND status = 'waiting'
            ORDER BY
                priority_score DESC,
                created_at ASC
            LIMIT 1
            FOR UPDATE SKIP LOCKED
        `, [activityId]);

        let promoted = null;

        if (waitingResult.rows.length > 0) {
            const promotedResult = await client.query(`
                UPDATE waiting_list
                SET
                    status = 'promoted_pending',
                    deadline_confirmation =
                        CURRENT_TIMESTAMP + INTERVAL '48 hours'
                WHERE id = $1
                RETURNING *
            `, [waitingResult.rows[0].id]);

            promoted = promotedResult.rows[0];
        }

        await client.query('COMMIT');

        return {
            activityId,
            promoted
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}


module.exports = {
    addToWaitingList,
    getWaitingList,
    promoteNextMember,
    confirmPromotion,
    expirePromotions,
    cancelRegistrationAndPromote
};