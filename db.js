var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    database: 'mysql',
    user: 'raman',
    password: 'raman@12345',
});

connection.connect(function (err) {
    if (err) throw err;

    console.log('Connected ');
});
module.exports = connection;