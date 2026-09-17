const router = require('find-my-way')();

const homeController = require('./controllers/homeController');
const facilityController = require('./controllers/facilityController');

router.on('GET', '/', homeController.index);

router.on('GET', '/activities', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Liste des activites');
});

router.on('GET', '/facilities', facilityController.index);
router.on('POST', '/facilities', facilityController.create);
router.on('POST', '/facilities/update', facilityController.update);
router.on('POST', '/facilities/delete', facilityController.remove);
router.on('POST', '/test', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`bonjour ${req.body.name}` );
});

module.exports = router;