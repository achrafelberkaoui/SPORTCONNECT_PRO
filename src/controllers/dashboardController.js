const render = require('../utils/renderer');
const dashboardService = require('../services/dashboardService');
async function index(req, res) {
    try {

    const upcomingActivities = await dashboardService.getUpcomingActivities();
       const stats =
            await dashboardService.getDashboardStats();

        const activities =
            await dashboardService.getActivityOccupancy();

        render(res, 'dashboard', {
            stats,
            activities,
            upcomingActivities
        });

    } catch (error) {

        console.error(error);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Erreur serveur');
    }
}

module.exports = {
    index
};