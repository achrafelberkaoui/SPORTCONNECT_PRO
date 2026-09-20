const render = require('../utils/renderer');
const memberService = require('../services/memberService');

async function index(req, res) {
    try {
        const members = await memberService.getAllMembers();
        const families = await memberService.getAllFamilies();

        render(res, 'members', {
            members,
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
            first_name,
            last_name,
            date_of_birth,
            is_resident,
            family_id,
            medical_certificate_date,
            pass_sport_code
        } = req.body;

        await memberService.createMember(
            first_name,
            last_name,
            date_of_birth,
            is_resident === 'on',
            family_id ? Number(family_id) : null,
            medical_certificate_date,
            pass_sport_code
        );

        res.statusCode = 302;
        res.setHeader('Location', '/members');
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
            first_name,
            last_name,
            date_of_birth,
            is_resident,
            family_id,
            medical_certificate_date,
            pass_sport_code
        } = req.body;

        await memberService.updateMember(
            Number(id),
            first_name,
            last_name,
            date_of_birth,
            is_resident === 'on',
            family_id ? Number(family_id) : null,
            medical_certificate_date,
            pass_sport_code
        );

        res.statusCode = 302;
        res.setHeader('Location', '/members');
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

        await memberService.deleteMember(Number(id));

        res.statusCode = 302;
        res.setHeader('Location', '/members');
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