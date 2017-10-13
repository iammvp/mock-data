const Mock = require('./lib');
const schema = require('./examples/schema1.json');

const mocker = new Mock(schema);
mocker.init();