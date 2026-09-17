const render = require('../utils/renderer');

function index(req, res) {
    render(res, 'home', {});
}

module.exports = {
    index
};