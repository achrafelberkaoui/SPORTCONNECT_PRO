const render = require('../utils/renderer');
const familyService = require('../services/familyService');

async function index(req, res) {
    try {
        const families = await familyService.getAllFamilies();

        render(res, 'families', {
            families
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
            family_name,
            quotient_familial
        } = req.body;

        await familyService.createFamily(
            family_name,
            Number(quotient_familial)
        );

        res.statusCode = 302;
        res.setHeader('Location', '/families');
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
            family_name,
            quotient_familial
        } = req.body;

        await familyService.updateFamily(
            Number(id),
            family_name,
            Number(quotient_familial)
        );

        res.statusCode = 302;
        res.setHeader('Location', '/families');
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

        await familyService.deleteFamily(Number(id));

        res.statusCode = 302;
        res.setHeader('Location', '/families');
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