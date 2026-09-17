const router = require('find-my-way')();
const render = require('./utils/renderer');
const facilityService = require('./services/facilityService');

router.on('GET', '/', (req, res)=>{
    render(res, 'home',{ name: 'achraf'});
});

router.on('GET', '/activities', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Liste des activites');
});

router.on('GET', '/facilities', async (req, res) => {

    try {
     const facilities = await facilityService.getAllFacilities();
        render(res, 'facilities', {
            facilities
        });
    }catch(error){
        console.error(error);
        res.statusCode = 500;
        res.end('Erreur serveur');
    }
});

router.on('POST', '/test', (req, res) => {
    console.log(req.body);

    res.statusCode = 302;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`bonjour ${req.body.name}`);
});

module.exports = router;