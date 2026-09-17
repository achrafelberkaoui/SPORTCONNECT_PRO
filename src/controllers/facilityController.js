const render = require('../utils/renderer');
const facilityService = require('../services/facilityService');

async function index(req, res) {
    try {
        const facilities = await facilityService.getAllFacilities();
        render(res, 'facilities', {
            facilities
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

        const { name, type, erp_capacity } = req.body;
        await facilityService.createFacility(
            name,
            type,
            Number(erp_capacity)
        );
        res.statusCode = 302;
        res.setHeader('Location', '/facilities');
        res.end();
    }catch(error){
        console.error(error);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Erreur serveur');
    }
}

async function update(req, res) {
    try{
        const { id, name, type, erp_capacity } = req.body;
        await facilityService.updateFacility(
            Number(id),
            name,
            type,
            Number(erp_capacity)
        );
        res.statusCode = 302;
        res.setHeader('Location', '/facilities');
        res.end();

    }catch(error) {
        console.error(error);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Erreur serveur');
    }
}

async function remove(req, res) {

    try {
        const { id } = req.body;

        await facilityService.deleteFacility(
            Number(id)
        );
        res.statusCode = 302;
        res.setHeader('Location', '/facilities');
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