const router = require('find-my-way')();
const rendder = require('../src/utils/renderer')
const homeController = require('./controllers/homeController');
const facilityController = require('./controllers/facilityController');
const associationController = require('./controllers/associationController');
const activityController = require('../src/controllers/activityController');
const memberController = require('./controllers/memberController');
const familyController = require('./controllers/familyController');
const registrationController = require('./controllers/registrationController');
const waitingListController = require('./controllers/waitingListController');

const dashboardController = require('./controllers/dashboardController');
const { render } = require('ejs');

router.on('GET', '/', (req, res) => {
    rendder(res, 'home');
});

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

//dashboard
router.on('GET','/dashboard',dashboardController.index);

//exports
module.exports = router;