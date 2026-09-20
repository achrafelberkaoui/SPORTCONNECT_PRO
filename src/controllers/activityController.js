const render = require('../utils/renderer');
const activityService = require('../services/activityService');

async function index(req, res) {
    try {
        const activities = await activityService.getAllActivities();
        const formData = await activityService.getActivityFormData();
        render(res, 'activities', {
            activities,
            associations: formData.associations,
            facilities: formData.facilities
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

        await activityService.createActivity(
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