const render = require('../utils/renderer');
const registrationService = require('../services/registrationService');
const pool = require('../config/db');

async function index(req, res) {
    try {
        const membersResult = await pool.query(`
            SELECT id, first_name, last_name
            FROM members
            ORDER BY last_name, first_name
        `);

        const activitiesResult = await pool.query(`
            SELECT id, name, activity_date, start_time
            FROM activities
            ORDER BY activity_date, start_time
        `);

        const registrationsResult = await pool.query(`
            SELECT
                registrations.id,
                registrations.final_price,
                registrations.payment_plan,
                registrations.status,
                members.first_name,
                members.last_name,
                activities.name AS activity_name
            FROM registrations
            JOIN members
                ON members.id = registrations.member_id
            JOIN activities
                ON activities.id = registrations.activity_id
            ORDER BY registrations.id DESC
        `);

        render(res, 'registrations', {
            members: membersResult.rows,
            activities: activitiesResult.rows,
            registrations: registrationsResult.rows
        });

    } catch (error) {
        console.error(error);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Erreur serveur');
    }
}

async function create(req, res) {
    try {
        const {
            member_id,
            activity_id,
            payment_plan
        } = req.body;

        await registrationService.createRegistration(
            Number(member_id),
            Number(activity_id),
            payment_plan
        );
        
        if (result.waiting) {
            res.statusCode = 302;
            res.setHeader('Location', '/registrations?waiting=1');
            return res.end();
        }

        res.statusCode = 302;
        res.setHeader('Location', '/registrations');
        res.end();

    } catch (error) {
        console.error(error);

        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end(error.message);
    }
}

module.exports = {
    index,
    create
};