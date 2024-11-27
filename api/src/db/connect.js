const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit:10,
    host:'10.89.240.78',
    user:'kauanny',
    password:'senai@604',
    database:'projeto_reservas'
});


module.exports = pool;