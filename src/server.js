const http = require('node:http');
const path = require('node:path');
const serveStatic = require('serve-static');
const router = require('./router');
const bodyParser = require('body-parser');

const parseForme = bodyParser.urlencoded({ extended : false});
const publicDir = path.join(__dirname, '..' , 'public');
const serve = serveStatic(publicDir);
const server = http.createServer((req, res) => {
    console.log('REQUÊTE :', req.method, req.url);
    serve(req, res, () => {
        parseForme(req, res, ()=>{
            router.lookup(req, res);
        })
    });
});

server.listen(3000, () => {
    console.log('Serveur lance sur http://localhost:3000');
});