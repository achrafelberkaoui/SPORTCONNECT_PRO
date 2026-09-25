const pool = require('../config/db');
const eligibilityService = require('./eligibilityService');
const pricingService = require('./pricingService');

async function getRegistrationData(memberId, activityId) {
    const result = await pool.query(
        `SELECT
            members.id AS member_id,
            members.first_name,
            members.last_name,
            members.date_of_birth,
            members.is_resident,
            members.family_id,
            members.medical_certificate_date,
            members.pass_sport_code,

            activities.id AS activity_id,
            activities.name AS activity_name,
            activities.base_price,
            activities.max_capacity,
            activities.min_age,
            activities.max_age,
            activities.all_publics

        FROM members
        CROSS JOIN activities
        WHERE members.id = $1
          AND activities.id = $2`,
        [memberId, activityId]
    );

    if (result.rows.length === 0) {
        throw new Error(
            'Membre ou activité introuvable'
        );
    }

    return result.rows[0];
}

async function createRegistration(
    memberId,
    activityId,
    paymentPlan = '1x'
) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const activityResult = await client.query(
            `SELECT
                id,
                name,
                base_price,
                max_capacity,
                min_age,
                max_age,
                all_publics
             FROM activities
             WHERE id = $1
             FOR UPDATE`,
            [activityId]
        );

        if (activityResult.rows.length === 0) {
            throw new Error('Activité introuvable');
        }

        const activity = activityResult.rows[0];

        const memberResult = await client.query(`
            SELECT
                members.id,
                members.first_name,
                members.last_name,
                members.date_of_birth,
                members.is_resident,
                members.family_id,
                members.medical_certificate_date,
                members.pass_sport_code,
                families.quotient_familial
            FROM members
            LEFT JOIN families
                ON families.id = members.family_id
            WHERE members.id = $1
        `, [memberId]);

        if (memberResult.rows.length === 0) {
            throw new Error('Membre introuvable');
        }

        const member = memberResult.rows[0];
        const priorityScore = member.is_resident ? 10 : 0;

        let familyRank = 1;

        if (member.family_id !== null) {
            const familyMembersResult = await client.query(`
                SELECT id
                FROM members
                WHERE family_id = $1
                ORDER BY id
            `, [member.family_id]);

            const familyIndex = familyMembersResult.rows.findIndex(
                familyMember => familyMember.id === member.id
            );

            if (familyIndex !== -1) {
                familyRank = familyIndex + 1;
            }
        }


        const seasonEndDate = new Date(
            `${new Date().getFullYear()}-12-31`
        );

        const ageEligible =
            eligibilityService.checkAgeEligibility(
                member.date_of_birth,
                activity.min_age,
                activity.max_age,
                activity.all_publics,
                seasonEndDate
            );

        if (!ageEligible) {
            throw new Error(
                'Le membre ne respecte pas les conditions d’âge'
            );
        }


        const medical =
            eligibilityService.checkMedicalCompliance(
                member.medical_certificate_date,
                activity.name
            );
            
            console.log(medical);
            


        const countResult = await client.query(
            `SELECT COUNT(*) AS count
             FROM registrations
             WHERE activity_id = $1
               AND status IN (
                   'confirmed',
                   'medical_non_compliant'
               )`,
            [activityId]
        );

        const registrationCount =
            Number(countResult.rows[0].count);

        if (registrationCount >= activity.max_capacity) {
            const priorityScore = member.is_resident ? 10 : 0;

            const waitingResult = await client.query(`
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

            await client.query('COMMIT');

            return {
                waiting: true,
                registration: null,
                waitingList: waitingResult.rows[0]
            };
        }

            const price = pricingService.calculatePricing({
                basePrice: activity.base_price,
                isResident: member.is_resident,
                familyRank: familyRank,
                quotientFamilial: member.quotient_familial,
                hasValidPassSport: Boolean(member.pass_sport_code)
            });


        const status = medical.valid ? 'confirmed' : 'medical_non_compliant';

        const registrationResult =
            await client.query(
                `INSERT INTO registrations (
                    member_id,
                    activity_id,
                    final_price,
                    payment_plan,
                    status
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`,
                [
                    memberId,
                    activityId,
                    price,
                    paymentPlan,
                    status
                ]
            );

        await client.query('COMMIT');

        return registrationResult.rows[0];

    } catch (error) {

        await client.query('ROLLBACK');

        throw error;

    } finally {

        client.release();
    }
}

module.exports = {
    getRegistrationData,
    createRegistration
};