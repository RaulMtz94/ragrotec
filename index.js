var jwt = require('jwt-simple');
var restify = require('restify');
var mysql = require('mysql');
//----------CONTROL DE CONEXION MYSQL DATABASE-------------
var db_config = {
      host: 'sql135.main-hosting.eu',
      user: 'u371251824_raul',
      password: 'raulmtz1',
      database: 'u371251824_agro'
  };
var connection;
function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.
  
    connection.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
  }
  
  handleDisconnect();



//---------------VARIABLES PARA JWT-----------------------------
var payload = { nombre: 'raul' };
var secret = 'holamundo';
var token = jwt.encode(payload, secret);
console.log(token);
var decoded = jwt.decode(token, secret);
console.log(decoded); //=> { foo: 'bar' }

//---------------------INICIAR SERVIDOR-------------------------

 
var server = restify.createServer({
    name : "usuarios"
});

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(process.env.PORT  , () => console.log('OK'))
//--------------------------------------------------------------
var PATH = '/usuarios'
server.get({path : PATH , version : '0.0.1'} , findAllUsers);
server.get({path : PATH +'/:userId' , version : '0.0.1'} , findUser);
server.post({path : PATH , version: '0.0.1'} , postNewUser);
server.del({path : PATH +'/:userId' , version: '0.0.1'} , deleteUser);
server.get({path:'/coordenadas', version : '0.0.1' }, buscarcoordenadas);


//----------ruta protegida------------------
server.post('/protegida',function(req,res,next){
    var token = req.headers.secret;
    console.log(token);
    if(secret==token){
        console.log('Acceso');
        res.redirect('/usuarios',next);
    }else{
        console.log(req.headers.secret);
        console.log("Error de auth");
    }
   
});

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
//--------------------BUSCAR COORDENADAS---------------------
function buscarcoordenadas(req, res, next){
    connection.query('SELECT * FROM coordenadas', function (error, results){
      if(error) throw error;
      console.log(results);
      res.send(200, results);
      return next();
  });
}

 /*
server.use(jwt({
    secret: 'holamundo',
    credentialsRequired: false,
    getToken: function fromHeaderOrQuerystring (req) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
          return req.headers.authorization.split(' ')[1];
      } else if (req.query && req.query.token) {
        return req.query.token;
      }
      return null;
    }
  }));
  */
