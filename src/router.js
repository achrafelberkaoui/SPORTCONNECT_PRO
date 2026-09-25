const router = require('find-my-way')();

const homeController = require('./controllers/homeController');
const facilityController = require('./controllers/facilityController');
const associationController = require('./controllers/associationController');
const activityController = require('../src/controllers/activityController');
const memberController = require('./controllers/memberController');
const familyController = require('./controllers/familyController');
const registrationController = require('./controllers/registrationController');
const waitingListController = require('./controllers/waitingListController');
router.on('GET', '/', homeController.index);

//activities
router.on('GET','/activities',activityController.index);
router.on('POST','/activities',activityController.create);
router.on('POST','/activities/update',activityController.update);
router.on('POST','/activities/delete',activityController.remove);

//families
router.on('GET','/families',familyController.index);
router.on('POST','/families',familyController.create);
router.on('POST','/families/update',familyController.update);
router.on('POST','/families/delete',familyController.remove);

//facilities
router.on('GET', '/facilities', facilityController.index);
router.on('POST', '/facilities', facilityController.create);
router.on('POST', '/facilities/update', facilityController.update);
router.on('POST', '/facilities/delete', facilityController.remove);
router.on('POST', '/test', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`bonjour ${req.body.name}` );
});

//associations
router.on('GET', '/associations', associationController.index);
router.on('POST', '/associations', associationController.create);
router.on('POST', '/associations/update', associationController.update);
router.on('POST', '/associations/delete', associationController.remove);

//members
router.on('GET','/members',memberController.index);
router.on('POST','/members',memberController.create);
router.on('POST','/members/update',memberController.update);
router.on('POST','/members/delete',memberController.remove);

//registrations
router.on('GET','/registrations',registrationController.index);
router.on('POST','/registrations',registrationController.create);

//waiting-list
router.on('GET','/activities/:id/waiting-list',waitingListController.index);
router.on('POST','/waiting-list/confirm',waitingListController.confirm);

//exports
module.exports = router;