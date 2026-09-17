const render = require('../utils/renderer');
const associationService = require('../services/associationService');

async function index(req, res) {
    try {
        const associations =
            await associationService.getAllAssociations();

        render(res, 'associations', {
            associations
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
        const { name, description } = req.body;

        await associationService.createAssociation(
            name,
            description
        );

        res.statusCode = 302;
        res.setHeader('Location', '/associations');
        res.end();

    } catch (error) {
        console.error(error);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Erreur serveur');
    }
}

async function update(req, res) {
    try {
        const { id, name, description } = req.body;

        await associationService.updateAssociation(
            Number(id),
            name,
            description
        );

        res.statusCode = 302;
        res.setHeader('Location', '/associations');
        res.end();

    } catch (error) {
        console.error(error);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Erreur serveur');
    }
}

async function remove(req, res) {
    try {
        const { id } = req.body;

        await associationService.deleteAssociation(
            Number(id)
        );

        res.statusCode = 302;
        res.setHeader('Location', '/associations');
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