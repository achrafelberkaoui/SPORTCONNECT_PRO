const render = require('../utils/renderer');
const waitingListService = require('../services/waitingListService');

async function index(req, res,params) {
    try {
        const activityId = Number(params.id);

        const waitingList =
            await waitingListService.getWaitingList(activityId);

        render(res, 'waiting-list', {
            waitingList
        });

    } catch (error) {
        console.error(error);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Erreur serveur');
    }
}

async function confirm(req, res) {
    try {
        const waitingListId = Number(req.body.waiting_list_id);

        await waitingListService.confirmPromotion(waitingListId);

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
    confirm
};