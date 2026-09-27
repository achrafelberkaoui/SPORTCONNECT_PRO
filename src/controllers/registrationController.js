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

        const memberId = Number(req.body.member_id);
        const activityId = Number(req.body.activity_id);
        const paymentPlan = req.body.payment_plan;

        const result = await registrationService.createRegistration(
            memberId,
            activityId,
            paymentPlan
        );

        console.log('Résultat inscription :', result);

        res.statusCode = 302;
        res.setHeader('Location', '/registrations');
        res.end();

    } catch (error) {

        console.error('ERREUR INSCRIPTION :', error);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');

        res.end(`
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <title>Erreur inscription</title>
            </head>

            <body style="
                font-family: Arial;
                padding: 40px;
                background: #f5f5f5;
            ">

                <h1>Erreur lors de l'inscription</h1>

                <p>
                    ${error.message}
                </p>

                <a href="/registrations">
                    Retour aux inscriptions
                </a>

            </body>
            </html>
        `);
    }
}

module.exports = {
    index,
    create
};