const ejs = require('ejs');
const path = require('node:path');

function render(res, view, data = {}){
    const viewPath = path.join(__dirname, '../../views', `${view}.ejs`);

    ejs.renderFile(viewPath, data, (error, html)=>{
        if(error){
            console.log(error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.rnd('server Error');
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(html);
    })
}

module.exports = render;