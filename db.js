// Mysql Connection
var db_config = {
    host      : 'junkstr.db.10121230.hostedresource.com',
    user      : 'junkstr',
    password  : 'Admin123#',
    database  : 'junkstr'
};

var mysql = function handleDisconnect() {
  return require('mysql').createConnection(db_config); // Recreate the connection, since
}
module.exports.handleDisconnect = mysql;