const render = require('../utils/renderer');
const activityService = require('../services/activityService');

function isoDate(date) {
    return new Date(date).toISOString().split('T')[0];
}

function fmtPrice(price) {
    return `${Number(price).toFixed(2)} DH`;
}

function fmtDate(date) {
    return new Date(date).toLocaleDateString('fr-FR');
}

function isToday(date) {
    return isoDate(date) === isoDate(new Date());
}

function fmtTime(time) {
    if (!time) return '';
    return String(time).slice(0, 5);
}


async function index(req, res) {
    try {
        const activities = await activityService.getAllActivities();
        const formData = await activityService.getActivityFormData();

        const totalActivities = activities.length;

        const today = new Date().toISOString().split('T')[0];

        const todayActivities = activities.filter(activity => {
            return String(activity.activity_date).slice(0, 10) === today;
        }).length;

        const totalCapacity = activities.reduce((total, activity) => {
            return total + Number(activity.max_capacity || 0);
        }, 0);

        const usedFacilities = new Set(
            activities.map(activity => activity.facility_id)
        ).size;

        render(res, 'activities', {
            activities,
            associations: formData.associations,
            facilities: formData.facilities,

            totalActivities,
            todayActivities,
            totalCapacity,
            usedFacilities,

            // Helpers utilisés par activities.ejs
            isoDate,
            fmtPrice,
            fmtDate,
            isToday,
            fmtTime
        });

    } catch (error) {
        console.error(error);

        if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Erreur serveur');
        }
    }
}

async function create(req, res) {
    try {
        const {name,base_price,max_capacity,activity_date,start_time,end_time,min_age,max_age,all_publics,association_id,facility_id} = req.body;

        await activityService.createActivity(name,Number(base_price),Number(max_capacity),activity_date,start_time,end_time,Number(min_age)
        ,Number(max_age),all_publics === 'on',Number(association_id),Number(facility_id));

        res.statusCode = 302;
        res.setHeader('Location', '/activities');
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

async function update(req, res) {
    try {
        const {
            id,
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
        } = req.body;

        await activityService.updateActivity(
            Number(id),
            name,
            Number(base_price),
            Number(max_capacity),
            activity_date,
            start_time,
            end_time,
            Number(min_age),
            Number(max_age),
            all_publics === 'on',
            Number(association_id),
            Number(facility_id)
        );

        res.statusCode = 302;
        res.setHeader('Location', '/activities');
        res.end();

    } catch (error) {
        console.error(error);

        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end(error.message);
    }
}

async function remove(req, res) {
    try {
        const { id } = req.body;

        await activityService.deleteActivity(Number(id));

        res.statusCode = 302;
        res.setHeader('Location', '/activities');
        res.end();

    } catch (error) {
        console.error(error);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Erreur serveur');
    }
}

module.exports = {
    index,
    create,
    update,
    remove
};