//----------------CONEXION A LA BASE DE DATOS-------------------
var restify = require('restify');
var mysql = require('mysql');
connection = mysql.createConnection({
               host : 'localhost',
               user : 'root',
               password : 'raulmtz1',
               database: 'AGROTEC'
         });
//--------------------------------------------------------------
//---------------------INICIAR SERVIDOR-------------------------
var ip_addr = '127.0.0.1';
var port    =  '1234';
 
var server = restify.createServer({
    name : "usuarios"
});

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.listen(port ,ip_addr, function(){
    console.log('%s activo en %s ', server.name , server.url);
});
//--------------------------------------------------------------
var PATH = '/usuarios'
server.get({path : PATH , version : '0.0.1'} , findAllUsers);
server.get({path : PATH +'/:userId' , version : '0.0.1'} , findUser);
server.post({path : PATH , version: '0.0.1'} , postNewUser);
server.del({path : PATH +'/:userId' , version: '0.0.1'} , deleteUser);


//--------------------------------------------------------------
//------------------------FUNCION PARA LEER TODOS LOS USUARIOS--
function findAllUsers(req, res, next){
    connection.query('SELECT * FROM usuarios', function (error, results){
      if(error) throw error;
      console.log(results);
      res.send(200, results);
      return next();
  });
}
//-------------------FUNCION PARA ENCONTRAR UN USUARIO EN ESPECIFICO-------
function findUser(req, res, next){
    connection.query('SELECT * FROM usuarios WHERE id='+req.params.userId, function(error, results){
     	if(error) throw error;
        console.log(results);
        res.send(200, results);
        return next();
    });
}
//-----------------------FUNCION PARA INSERTAR A UN USUARIO------------
//-----------------------PENDIENTE-------------------------------------
function postNewUser(req , res , next){
    //rest api to create a new record into mysql database
    var postData  = req.body;
    connection.query('INSERT INTO usuarios SET ?', postData, function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
    console.log("REGISTRO");
  });
 
 
}
//--------------------ELIMINAR UN USUARIO EN ESPEFICICO--------------
function deleteUser(req , res , next){
    connection.query('DELETE FROM usuarios WHERE id = '+req.params.userId, function (error, success){
        if(error) throw error;
        res.send(200, 'Eliminado con exito');
    }); 
}
